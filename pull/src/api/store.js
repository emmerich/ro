// import { join } from 'path'
// import { readFileSync, writeFileSync } from 'fs'

// const KEY_FILE = join(__dirname, '..', '..', 'input', 'reddit.key')
const REDDIT_KEY = 'reddit_key'

export default (redis) => Object.assign({
  getKey: async () => redis.get(REDDIT_KEY),
  setKey: async (key) => redis.set(REDDIT_KEY, key)
})
// export const getKey = async () => readFileSync(KEY_FILE).toString('utf-8').trim()
// export const setKey = async (id) => writeFileSync(KEY_FILE, id)
