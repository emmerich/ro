import { omit, assoc, difference } from 'ramda'
import { version } from '../../package.json'

const getKey = (subreddit, postID) => `current:${subreddit}:${postID}`
const getAllKeys = (subreddit) => `current:${subreddit}:*`
const getPostFromRedditKey = (subreddit, key) => key.replace(`current:${subreddit}:`, '')

const buildNewPost = (post) => Object.assign({}, post, { version })

export default (redisPub, redis, log) => {
  return async ({ subreddit, posts }) => {

    log.info(`Process pipe received ${posts.length} posts for /r/${subreddit}`)
    const now = Date.now()

    await Promise.all(posts.map(async (post) => {
      const key = getKey(subreddit, post.id)
      const previous = await redis.get(key)
      const isNew = !previous

      // TODO This can emit the same post multiple times even if the post did not change.
      let updatedPost = isNew ? buildNewPost(post) : JSON.parse(previous)

      if(isNew) {
        updatedPost = assoc('entered_frontpage', now, updatedPost)
      }

      updatedPost = assoc('last_fetch', now, updatedPost)

      const stringified = JSON.stringify(updatedPost)
      await redis.set(key, stringified)
      const event = isNew ? 'posts_new' : 'posts_updated'

      log.debug(`${event}: /r/${subreddit} ${post.id}`)
      redisPub.publish(event, stringified)
    }))

    const currentFrontPageIDs = posts.map((post) => post.id)
    const currentRedisIDs = await redis.keys(getAllKeys(subreddit))

    const lastSeenFrontPageIDs = currentRedisIDs.map((key) => getPostFromRedditKey(subreddit, key))
    const droppedIDs = difference(lastSeenFrontPageIDs, currentFrontPageIDs)

    if(droppedIDs.length === 0) {
      return
    }

    await Promise.all(droppedIDs.map(async (id) => {
      const redisKey = getKey(subreddit, id)
      const tmpKey = `removing:${redisKey}`

      // Rename first to ensure its atomic.
      await redis.rename(redisKey, tmpKey)
      const stringified = await redis.get(tmpKey)
      await redis.del(tmpKey)

      const postBeforeDropped = JSON.parse(stringified)
      const post = assoc('dropped_from_frontpage', now, postBeforeDropped)

      log.debug(`posts_dropped: /r/${subreddit} ${post.id}`)
      redisPub.publish('posts_dropped', JSON.stringify(post))
    }))
  }
}
