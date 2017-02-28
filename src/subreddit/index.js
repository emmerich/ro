import getPosts from './posts'
import getComments from './comments'

export default async (subreddit, graw) => {
  const posts = await getPosts(subreddit, graw)

  const postsWithComments = await Promise.all(posts.map(async (post) => {
    const comments = await getComments(subreddit, post.id, graw)
    return Object.assign({}, post, { comments })
  }))

  return postsWithComments
}
