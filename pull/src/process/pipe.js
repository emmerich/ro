import { omit, assoc, difference } from 'ramda'

const getKey = (subreddit, postID) => `current:${subreddit}:${postID}`
const getAllKeys = (subreddit) => `current:${subreddit}:*`
const getPostFromRedditKey = (subreddit, key) => key.replace(`current:${subreddit}:`, '')

export default (redisPub, redis, log) => {
  return async ({ subreddit, posts }) => {

    log.info(`Process pipe received ${posts.length} posts for /r/${subreddit}`)

    await Promise.all(posts.map(async (post) => {
      // { 5htde: post }
      // seen = assoc(post.id, post, seen)
      const key = getKey(subreddit, post.id)
      const previous = await redis.get(key)
      const isNew = !previous

      // TODO This can emit the same post multiple times even if the post did not change.
      let updatedPost = post

      if(isNew) {
        log.trace(`${post.id} is new on the frontpage`)
        updatedPost = assoc('entered_frontpage', Date.now(), post)
      }

      const stringified = JSON.stringify(updatedPost)
      await redis.set(key, stringified)
      redisPub.publish(isNew ? 'posts_new' : 'posts_updated', stringified)
    }))

    const currentFrontPageIDs = posts.map((post) => post.id)
    const currentRedisIDs = await redis.keys(getAllKeys(subreddit))

    const lastSeenFrontPageIDs = currentRedisIDs.map((key) => getPostFromRedditKey(subreddit, key))
    const idsThatDroppedOffTheFrontPage = difference(lastSeenFrontPageIDs, currentFrontPageIDs)

    log.debug(`${idsThatDroppedOffTheFrontPage.length} posts dropped off the front page since last check.`)

    if(idsThatDroppedOffTheFrontPage.length === 0) {
      return
    }

    log.trace(`Dropped: ${idsThatDroppedOffTheFrontPage.join(', ')}`)

    Promise.all(idsThatDroppedOffTheFrontPage.map(async (id) => {
      const redisKey = getKey(subreddit, id)

      const tmpKey = `to_remove:${redisKey}`

      log.trace(`Removing redis key: ${redisKey}`)

      // Rename first to ensure its atomic.
      await redis.rename(redisKey, tmpKey)
      const post = await redis.get(tmpKey)
      await redis.del(tmpKey)

      redisPub.publish('posts_dropped', post)
    }))

    // console.log('all ids', ids.join(', '))
    // const idsThatDroppedOffTheFrontPage = difference(Object.keys(seen), ids)
    // console.log(idsThatDroppedOffTheFrontPage)
    // const postsThatDroppedOffTheFrontPage = idsThatDroppedOffTheFrontPage.map((id) => seen[id])
    //
    // postsThatDroppedOffTheFrontPage.forEach((post) => emitter.emit('dropped', { subreddit, post }))
    // seen = omit(idsThatDroppedOffTheFrontPage, seen)
    //
    // seenSubreddits = assoc(subreddit, seen, seenSubreddits)
  }
}
