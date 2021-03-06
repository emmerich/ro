import RedisClient from 'ioredis'
import { join } from 'path'
import createLogger from 'ro-common/src/log'
import createMongoClient from 'ro-common/src/mongo/createMongoClient'
import handleNewPostBuilder from './handlers/newPost'
import handleUpdatedPostBuilder from './handlers/updatedPost'
import handleDroppedPostBuilder from './handlers/droppedPost'

const OUTPUT_ROOT = join('/', 'usr', 'db', 'posts')

;(async () => {
  const log = createLogger()
  const redis = new RedisClient({ host: 'ro-redis' })
  const mongo = await createMongoClient('mongodb://ro-db:27017/ro')

  const templatesCollection = mongo.collection('templates')
  const alertsCollection = mongo.collection('alerts')

  const handleNewPost = handleNewPostBuilder(log)
  const handleUpdatedPost = handleUpdatedPostBuilder(log)
  const handleDroppedPost = handleDroppedPostBuilder(OUTPUT_ROOT, log)

  redis.on('message', (channel, message) => {
    const post = JSON.parse(message)

    switch(channel) {
      case 'posts_new':
        return handleNewPost(post, templatesCollection, alertsCollection)
      case 'posts_updated':
        return handleUpdatedPost(post, templatesCollection, alertsCollection)
      case 'posts_dropped':
        return handleDroppedPost(post)
    }
  })

  redis.subscribe('posts_new', 'posts_updated', 'posts_dropped')
})()
