export default async (collection, query) => new Promise((resolve, reject) => {
  collection.find(query).toArray((err, results) => {
    if(err) {
      return reject(err)
    }

    resolve(results)
  })
})
