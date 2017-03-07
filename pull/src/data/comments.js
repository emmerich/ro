import { omit, tail } from 'ramda'
import omitFalsey from '../functions/omitFalsey'

const COMMENT_KIND = 't1'
const UNWANTED_COMMENT_FIELDS = [
  'replies',
  'subreddit_id',
  'banned_by',
  'removal_reason',
  'likes',
  'user_reports',
  'saved',
  'report_reasons',
  'parent_id',
  'subreddit_name_prefixed',
  'approved_by',
  'edited',
  'subreddit',
  'subreddit_type',
  'mod_reports',
  'num_reports',
  'distinguished',
  'body_html',
  'author_flair_css_class',
  'author_flair_text',
  'depth',
  'created',
  'archived',
  'controversiality',
  'score_hidden',
  'name',
  'link_id'
]

const getThinComment = (comment) => omit(UNWANTED_COMMENT_FIELDS, comment)

const flattenComment = (comment) => {
  const data = comment.data

  if(comment.kind !== COMMENT_KIND) {
    return []
  }

  const thinComment = getThinComment(data)
  const withoutFalseyValues = omitFalsey(thinComment)
  let tempRes = [withoutFalseyValues]

  if(data.replies) {
    tempRes = tempRes.concat(flattenCommentArray(data.replies))
  }

  return tempRes
}

const flattenCommentArray = (arr) => {
  const comments = arr.data.children
  return comments.reduce((result, comment) => result.concat(flattenComment(comment)), [])
}

export default async (subreddit, postID, graw, log) => {
  const url = `/r/${subreddit}/comments/${postID}?depth=2&sort=top&limit=50`
  const resp = await graw(url)

  // The first item in the array is the post itself. Omit this.
  const responseWithoutOriginalPost = tail(resp)

  if(responseWithoutOriginalPost.length !== 1) {
    log.warn('Expected comments without original post to be only 1 array, but its more')
  }

  const comments = responseWithoutOriginalPost[0]
  const flattenedComments = flattenCommentArray(comments)

  return flattenedComments
}
