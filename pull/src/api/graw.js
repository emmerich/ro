import fetch from 'node-fetch'
import { queue } from 'async'
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

const request = async (url, id) => fetch(url, {
  headers: {
    'Authorization': `bearer ${id}`,
    'User-Agent': process.env.REDDIT_UA
  }
})

const create = async (redis, log) => {
  const store = createStore(redis)
  let id = await store.getKey()

  const doRequest = async (url) => {
    let res = await request(url, id)

    log.trace(`GRAW ${res.status} ${url}`)

    if(res.status === 401) {
      log.debug(`GRAW key has expired. Requesting new key.`)
      // ID has expired, need a new one.
      id = await refreshID(log)

      log.trace(`GRAW new access token ${id}`)
      await store.setKey(id)

      res = await request(url, id)
    }

    if(res.status !== 200) {
      log.error(`GRAW returned bad status ${res.statusText}`)
      throw `bad status ${res.status}`
    }

    return res.json()
  }

  const requestQueue = queue(async (task, callback) => {
    const url = task.url

    try {
      const resp = await doRequest(url)
      callback(null, resp)
    } catch (err) {
      callback(err)
    }
  }, 1)

  log.info(`Built GRAW. Initial id: ${id}`)

  return async (url) => new Promise((resolve, reject) => {
    let actualURL = `https://oauth.reddit.com${url}`

    requestQueue.push({ url: actualURL }, (err, resp) => {
      if(err) {
        return reject(err)
      }

      return resolve(resp)
    })
  })
}

export default create
