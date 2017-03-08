import fetch from 'node-fetch'
import { defer } from 'q'
import createStore from './store'

const refreshID = async (log) => {
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'post',
    headers: {
      'User-Agent': process.env.REDDIT_UA,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${process.env.REDDIT_KEY}`
    },
    body: 'grant_type=client_credentials'
  })

  const json = await res.json()
  return json.access_token
//   {
//   "access_token": "n9prJuEEYfSosXxqLlhn_ljic5U",
//   "token_type": "bearer",
//   "expires_in": 3600,
//   "scope": "*"
// }
}

const request = (url, id) => fetch(url, {
  headers: {
    'Authorization': `bearer ${id}`,
    'User-Agent': process.env.REDDIT_UA
  }
})

const create = async (redis, log) => {
  let requestQueue = []
  const store = createStore(redis)
  let id = await store.getKey()

  const first = defer()
  let currentRequest = first.promise
  first.resolve()

  log.info(`Built GRAW. Initial id: ${id}`)

  return async (url) => {
    let actualURL = `https://oauth.reddit.com${url}`

    currentRequest = currentRequest.then(async () => {
      let res = await request(actualURL, id)

      log.trace(`GRAW ${res.status} ${actualURL}`)

      if(res.status === 401) {
        log.debug(`GRAW key has expired. Requesting new key.`)
        // ID has expired, need a new one.
        id = await refreshID(log)

        log.trace(`GRAW new access token ${id}`)
        await store.setKey(id)

        res = await request(actualURL, id)
      }

      if(res.status !== 200) {
        log.error(`GRAW returned bad status ${res.statusText}`)
        throw `bad status ${res.status}`
      }

      return res.json()
    })

    return currentRequest
  }
}

export default create
