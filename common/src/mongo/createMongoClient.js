import { MongoClient } from 'mongodb'

export default (url) => new Promise((resolve, reject) => {
  MongoClient.connect(url, (err, db) => {
    if(err) {
      return reject(err)
    }

    resolve(db)
  })
})
