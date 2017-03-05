import processAlerts from '../alerts/process'

export default (log) => async (post, templatesCollection, alertsCollection) => {
  log.info(`NEW /r/${post.subreddit} - ${post.id}`)
  processAlerts(post, templatesCollection, alertsCollection, log)
}
