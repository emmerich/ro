import getPosts from './posts'
import getComments from './comments'

export default async (subreddit, graw, log) => {
  log.debug(`[/r/${subreddit}] Fetching subreddit`)

  const posts = await getPosts(subreddit, graw, log)

  const postsWithComments = await Promise.all(posts.map(async (post) => {
    const comments = await getComments(subreddit, post.id, graw, log)
    log.trace(`[/r/${subreddit}] post ${post.id} has ${comments.length} comments`)
    return Object.assign({}, post, { comments })
  }))

  log.debug(`[/r/${subreddit}] Successfully fetched`)
  return { subreddit, posts: postsWithComments }
}
