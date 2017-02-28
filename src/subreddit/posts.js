import { omit } from 'ramda'

const UNWANTED_POST_FIELDS = [
  'contest_mode',
  'banned_by',
  'likes',
  'suggested_sort',
  'user_reports',
  'clicked',
  'report_reasons',
  'saved',
  'mod_reports',
  'hidden',
  'archived',
  'removal_reason',
  'num_reports',
  'quarantine',
  'visited'
]

export default async (subreddit, graw) => {
  const url = `/r/${subreddit}/hot?limit=25`
  const resp = await graw(url)

  console.log(`Retrieved 25 hot posts for ${subreddit}`)

  const posts = resp.data.children
  const thinPosts = posts.map((post) => omit(UNWANTED_POST_FIELDS, post.data))

  return thinPosts
}
