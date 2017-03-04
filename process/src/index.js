import RedisClient from 'ioredis'
import { writeFileSync, ensureDirSync } from 'fs-extra'
import { join } from 'path'
import createLogger from 'ro-common/src/log'
import createMongoClient from 'ro-common/src/mongo/createMongoClient'

const OUTPUT_ROOT = join('/', 'usr', 'db', 'posts')

;(async () => {
  ensureDirSync(OUTPUT_ROOT)

  const log = createLogger()
  const redis = new RedisClient({ host: 'ro-redis' })
  const mongo = await createMongoClient('mongodb://ro-db:27017/ro')

  const handleNewPost = (post) => log.info('New post', post.subreddit, post.id)
  const handleUpdatedPost = (post) => log.info('Updated post', post.subreddit, post.id)

  const handleDroppedPost = (post) => {
    log.info('Dropped post', post.subreddit, post.id)
    const outputDir = join(OUTPUT_ROOT, post.subreddit)

    ensureDirSync(outputDir)
    writeFileSync(join(outputDir, `${post.id}.json`), JSON.stringify(post, null, 2))
  }

  redis.on('message', (channel, message) => {
    const post = JSON.parse(message)

    switch(channel) {
      case 'posts_new':
        return handleNewPost(post)
      case 'posts_updated':
        return handleUpdatedPost(post)
      case 'posts_dropped':
        return handleDroppedPost(post)
    }
  })

  redis.subscribe('posts_new', 'posts_updated', 'posts_dropped')
})()
