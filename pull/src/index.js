import RedisClient from 'ioredis'
import { pick } from 'ramda'
import getSubreddit from './data/subreddit'
import createGraw from './api/graw'
import createProcessPipe from './process/pipe'
import createLogger from 'ro-common/src/log'
import createMongoClient from 'ro-common/src/mongo/createMongoClient'
import getAll from 'ro-common/src/mongo/getAll'

const getSubredditsToFetch = async (mongo) => {
  const subreddits = await getAll(mongo.collection('subreddits'))
  return subreddits.map((sub) => pick(['name', 'schedule'], sub))
}

const fetchSubreddit = async (subreddit, graw, processPipe, log) => {
  log.info(`Getting /r/${subreddit}`)

  try {
    const data = await getSubreddit(subreddit, graw, log)
    await processPipe(data)
    log.info(`Successfully got /r/${subreddit}`)
  } catch(err) {
    log.error(`Error getting /r/${subreddit} - ${err.message}`)
  }
}

;(async () => {
  try {
    const log = createLogger()
    log.info(`Initializing with interval ${INTERVAL}ms`)

    const redis = new RedisClient({ host: 'ro-redis' })
    const redisEmitter = new RedisClient({ host: 'ro-redis' })

    const graw = await createGraw(redis, log)
    const processPipe = await createProcessPipe(redisEmitter, redis, log)

    const mongo = await createMongoClient('mongodb://ro-db:27017/ro')
    const subreddits = await getSubredditsToFetch(mongo)
    mongo.close()

    const jobs = subreddits.map(({ name, schedule }) => {
      if(!name) {
        log.error(`There is a subreddit in Mongo without a name.`)
        return process.exit(1)
      }

      if(!schedule) {
        log.error(`Subreddit /r/${name} does not have a schedule.`)
        return process.exit(1)
      }

      log.info(`Scheduling /r/${name} - ${schedule}`)
      return scheduleJob(schedule, () => fetchSubreddit(name, graw, processPipe, log))
    })

    log.info(`Successfully started ${jobs.length} jobs.`)
  } catch (err) {
    console.error(err.message, err.stack)
  }
})()
