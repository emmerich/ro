import fetch from 'node-fetch'
import { defer } from 'q'
import createStore from './store'

const refreshID = async () => {
  console.log('Refreshing reddit ID')

  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'post',
    headers: {
      'User-Agent': 'JohnnyBravo/0.1 by JBTopGuy',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic N1B0RU93Rkk5OUJ2OFE6RE1RR2x1WG16SnFINjZzNU1fU3cwMS1mLUQ4'
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
    'User-Agent': "JohnnyBravo/0.1 by JBTopGuy"
  }
})

const create = async (redis, log) => {
  let requestQueue = []
  const store = createStore(redis)
  let id = await store.getKey()

  const first = defer()
  let currentRequest = first.promise
  first.resolve()

  log.info(`Graw built with key ${id}`)

  return async (url) => {
    let actualURL = `https://oauth.reddit.com${url}`

    currentRequest = currentRequest.then(async () => {
      let res = await request(actualURL, id)

      if(res.status === 401) {
        // ID has expired, need a new one.
        id = await refreshID()
        await store.setKey(id)
        res = await request(actualURL, id)
      }

      if(res.status !== 200) {
        throw `bad status ${res.status}`
      }

      return res.json()
    })

    return currentRequest
  }
}

export default create
