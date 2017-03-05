import processAlerts from '../alerts/process'

export default (mongo, log) => async (post) => {
  log.info(`NEW /r/${post.subreddit} - ${post.id}`)
  processAlerts(post, mongo, log)
}
