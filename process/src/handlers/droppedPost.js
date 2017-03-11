import { writeFileSync, ensureDirSync } from 'fs-extra'
import { join } from 'path'
import finalize from './finalize'

export default (outputRoot, log) => async (postBeforeFinalized) => {
  const post = finalize(postBeforeFinalized)
  log.info(`DROPPED /r/${post.subreddit} - ${post.id}`)

  // For now, write to file.
  const outputDir = join(outputRoot, post.subreddit)
  ensureDirSync(outputDir)
  writeFileSync(join(outputDir, `${post.id}.json`), JSON.stringify(post))
}
