import { omit } from 'ramda'
import omitFalsey from '../functions/omitFalsey'

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
  'visited',
  'selftext_html',
  'subreddit_name_prefixed',
  'link_flair_css_class',
  'author_flair_css_class',
  'permalink',
  'thumbnail',
  'name',
  'approved_by',
  'brand_safe',
  'hide_score',
  'distinguished',
  'media_embed',
  'secure_media',
  'secure_media_embed',
  'subreddit_type',
  'created'
]

const UNWANTED_MEDIA_FIELD = [
  'oembed'
]

const LIMIT = 25

export default async (subreddit, graw, log) => {
  const url = `/r/${subreddit}/hot?limit=${LIMIT}`
  const resp = await graw(url)

  log.debug(`Retrieved ${LIMIT} hot posts for ${subreddit}`)

  const posts = resp.data.children
  const thinPosts = posts.map((post) =>
    Object.assign(
      omit(UNWANTED_POST_FIELDS, post.data),
      {
        media: omit(UNWANTED_MEDIA_FIELD, post.media)
      }
    )
  )

  const postsWithoutFalseyValues = thinPosts.map((post) => omitFalsey(post))

  return postsWithoutFalseyValues
}
