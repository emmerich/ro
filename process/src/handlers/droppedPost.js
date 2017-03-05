import { writeFileSync, ensureDirSync } from 'fs-extra'
import { join } from 'path'

export default (outputRoot, log) => async (post) => {
  log.info(`DROPPED /r/${post.subreddit} - ${post.id}`)

  // Extract data.
  
  const outputDir = join(outputRoot, post.subreddit)

  ensureDirSync(outputDir)
  writeFileSync(join(outputDir, `${post.id}.json`), JSON.stringify(post, null, 2))
}
