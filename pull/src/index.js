import RedisClient from 'ioredis'
import getSubreddit from './data/subreddit'
import createGraw from './api/graw'
import createProcessPipe from './process/pipe'
import createLogger from 'ro-common/src/log'
import createMongoClient from 'ro-common/src/mongo/createMongoClient'
import getAll from 'ro-common/src/mongo/getAll'

const INTERVAL = 1000 * 60 * 60

const getSubredditsToFetch = async (mongo) => {
  const subreddits = await getAll(mongo.collection('subreddits'))
  return subreddits.map((sub) => sub.name)
}

const fetchSubreddits = async (graw, processPipe, createMongoClient, log) => {
  const mongo = await createMongoClient()
  const subreddits = await getSubredditsToFetch(mongo)
  mongo.close()

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
    const boundCreateMongoClient = createMongoClient.bind(null, 'mongodb://ro-db:27017/ro')

    const graw = await createGraw(redis, log)
    const processPipe = await createProcessPipe(redisEmitter, redis, log)

    const run = () => fetchSubreddits(graw, processPipe, boundCreateMongoClient, log)

    run()
    setInterval(run, INTERVAL)
  } catch (err) {
    console.error(err.message, err.stack)
  }
})()
