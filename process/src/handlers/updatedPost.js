import processAlerts from '../alerts/process'

export default (mongo, log) => async (post) => {
  log.info(`UPDATED /r/${post.subreddit} - ${post.id}`)
  processAlerts(post, mongo, log)
}
