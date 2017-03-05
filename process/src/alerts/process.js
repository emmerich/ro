import get from 'ro-common/src/mongo/get'
import { contains, omit } from 'ramda'

const generateAllAlerts = (post, templates) => templates.reduce((result, template) => {
  let postMatches = []

  if(post.selftext && post.selftext.trim() && contains(template.text, post.selftext)) {
    postMatches = postMatches.concat({ field: 'selftext' })
  }

  if(post.title && post.title.trim() && contains(template.text, post.title)) {
    postMatches = postMatches.concat({ field: 'title' })
  }

  if(post.author && post.author.trim() && contains(template.text, post.author)) {
    postMatches = postMatches.concat({ field: 'author' })
  }

  const commentMatches = post.comments.reduce((matches, comment) => {
    if(comment.body && comment.body.trim() && contains(template.text, comment.body)) {
      matches = matches.concat({
        field: 'body',
        id: comment.id
      })
    }

    if(comment.author && comment.author.trim() && contains(template.text, comment.author)) {
      matches = matches.concat({
        field: 'author',
        id: comment.id
      })
    }

    return matches
  }, [])

  if(!postMatches.length && !commentMatches.length) {
    // No match.
    return result
  }

  return result.concat({
    templateID: template._id,
    template: omit([ '_id' ], template),

    postID: post.id,
    subreddit: post.subreddit,

    postMatches,
    commentMatches
  })
}, [])

const sendAlerts = async (alerts, alertsCollection, log) => Promise.all(alerts.map((alert) => {
  const withTimestamp = Object.assign({}, alert, { timestamp: Date.now() })
  log.info(`ALERT /r/${alert.subreddit} - ${alert.postID} [${alert.template.text} found in ${alert.field}]`)
  alertsCollection.insert(withTimestamp)
}))

const getNonTriggeredTemplates = async (templates, alertsCollection, post) => {
  // TODO What if a template is alerted for a post, and then a comment is added
  // which also triggers the alert?
  const alerts = await get(alertsCollection, {
    postID: post.id,
    templateID: { $in: templates.map((template) => template._id) }
  })

  return templates.filter((template) => !alerts.some((alert) => alert.templateID.equals(template._id)))
}

export default async (post, mongo, log) => {
  const templatesCollection = mongo.collection('templates')
  const alertsCollection = mongo.collection('alerts')

  const templates = await get(templatesCollection, {
    subreddits: { $in: [ post.subreddit ] }
  })

  const templatesThatHaventBeenTriggered = await getNonTriggeredTemplates(templates, alertsCollection, post)
  const preSentAlerts = generateAllAlerts(post, templatesThatHaventBeenTriggered)
  sendAlerts(preSentAlerts, alertsCollection, log)
}
