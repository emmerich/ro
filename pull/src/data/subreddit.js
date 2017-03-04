import getPosts from './posts'
import getComments from './comments'

export default async (subreddit, graw, log) => {
  const posts = await getPosts(subreddit, graw, log)

  const postsWithComments = await Promise.all(posts.map(async (post) => {
    const comments = await getComments(subreddit, post.id, graw, log)
    return Object.assign({}, post, { comments })
  }))

  return { subreddit, posts: postsWithComments }
}
