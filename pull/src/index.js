import RedisClient from 'ioredis'
import getSubreddit from './data/subreddit'
import createGraw from './api/graw'
import createProcessPipe from './process/pipe'
import createLogger from 'ro-common/src/log'
import createMongoClient from 'ro-common/src/mongo/createMongoClient'

const INTERVAL = 1000 * 60 * 2

const getSubredditsToFetch = async (mongo) => new Promise((resolve, reject) => {
  mongo.collection('subreddits').find({}).toArray((err, subreddits) => {
    if(err) {
      reject(err)
    }

    resolve(subreddits.map((sub) => sub.name))
  })
})

const getAll = async (graw, processPipe, mongo, log) => {
  const subreddits = await getSubredditsToFetch(mongo)

  log.info(`Getting ${subreddits.length} subreddits.`)

  const all = await Promise.all(subreddits.map(async (subreddit) => {
    try {
      const data = await getSubreddit(subreddit, graw, log)
      await processPipe(data)
    } catch (err) {
      return null
    }
  }))

  log.info(`End of process, next one at ${new Date(Date.now() + INTERVAL)}`)
}

;(async () => {
  try {
    const log = createLogger()
    log.info(`Initializing with interval ${INTERVAL}ms`)

    const redis = new RedisClient({ host: 'ro-redis' })
    const redisEmitter = new RedisClient({ host: 'ro-redis' })
    const mongo = await createMongoClient('mongodb://ro-db:27017/ro')

    const graw = await createGraw(redis, log)
    const processPipe = await createProcessPipe(redisEmitter, redis, log)
    getAll(graw, processPipe, mongo, log)
    setInterval(() => getAll(graw, processPipe, mongo, log), INTERVAL)
  } catch (err) {
    console.error(err.message, err.stack)
  }
})()
