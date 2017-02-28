import { writeFileSync, ensureDirSync, emptyDirSync, readFileSync } from 'fs-extra'
import { join } from 'path'
import getSubreddit from './subreddit'
import redditRequest from './redditRequest'

const OUTPUT_DIR = join(__dirname, '..', 'output')
const INPUT_DIR = join(__dirname, '..', 'input')

const getAll = async (graw) => {
  try {
    const subreddits = readFileSync(join(INPUT_DIR, 'subreddits'), { encoding: 'utf-8'})
      .split('\n')
      .filter((line) => line.trim())
    console.log(`Getting ${subreddits.length} subreddits and writing results to ${OUTPUT_DIR}`)

    ensureDirSync(OUTPUT_DIR)
    emptyDirSync(OUTPUT_DIR)

    const all = await Promise.all(subreddits.map(async (subreddit) => {
      try {
        const data = await getSubreddit(subreddit, graw)
        return { subreddit, data }
      } catch (err) {
        return null
      }
    }))

    all.filter((r) => r).forEach(({ subreddit, data }) => {
      writeFileSync(join(OUTPUT_DIR, `${subreddit}.json`), JSON.stringify(data, null, 2))
    })

    console.log('Finished processing.')
  } catch (err) {
    console.error(err.message, err.stack)
  }
}

const graw = redditRequest()
getAll(graw)
setInterval(() => getAll(graw), 1000 * 60 * 60)
