const REDDIT_KEY = 'reddit_key'

export default (redis) => Object.assign({
  getKey: async () => redis.get(REDDIT_KEY),
  setKey: async (key) => redis.set(REDDIT_KEY, key)
})
