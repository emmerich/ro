import fetch from 'node-fetch'
import { writeFileSync, ensureDirSync, emptyDirSync } from 'fs-extra'
import { uniq, flatten, uniqWith, assocPath, omit } from 'ramda'
import { join } from 'path'

const id = "6mP7uxSzgb3MFuyc8I8OlT8vcDk"

const get = async (url) => {
  let actualURL = `https://oauth.reddit.com${url}`

  // if(after) {
  //   actualURL = `${actualURL}&after=${after}`
  // }
  //
  // if(count) {
  //   actualURL = `${actualURL}&count=${count}`
  // }

  const res = await fetch(actualURL, {
    headers: {
      'Authorization': `bearer ${id}`,
      'User-Agent': "JohnnyBravo/0.1 by JBTopGuy"
    }
  })

  console.log(actualURL, res.status)
  return res.json()
}

const getPosts = async (url) => {
  const resp = await get(url)
  return resp.data.children
}

const getComments = async (url) => {
  const resp = await get(url)
  const flattenCommentArray = (arr) => {
    const comments = arr.data.children
    return comments.reduce((result, comment) => result.concat(flattenComment(comment)), [])
  }

  const flattenComment = (comment) => {
    const data = comment.data

    if(comment.kind === 'more') {
      return []
    }

    let tempRes = [omit(['replies'], data)]

    if(data.replies) {
      tempRes = tempRes.concat(flattenCommentArray(data.replies))
    }

    return tempRes
  }

  return resp.reduce((res, rootArray) => res.concat(flattenCommentArray(rootArray)), [])
}

let c = 0
const api = async (url) => {
  c++
  let result = []



  const loop = async (after, count) => {
    const res = await get(after, count)
    result = result.concat(res.children)

    if(res.after && result.length < 3) {
      return loop(res.after, result.length)
    } else {
      return result
    }
  }

  return loop(null, null)
}

// api(`/r/soccer/about/contributors`).then((res) => console.log(res))
//
// const search = (term) => {
//   fetch(`https://oauth.reddit.com/api/subreddits_by_topic?query=${term}`, {
//     headers: {
//       'Authorization': `bearer ${id}`,
//       'User-Agent': "JohnnyBravo/0.1 by JBTopGuy"
//     }
//   })
//     .then((res) => {
//       console.log(res)
//       return res.json()
//     })
//     .then((resjson) => console.log(resjson))
// }

// Backend
// Authors of top submissions in the past month
  // Treat self posts more importantly than links.
  // Get the top comments too

// Authors of submissions in the past week
  // Treat self posts more importantly than links.
  // Get the top comments too


// request per subreddit (worst case) = 500 + 5 = 505
// requests per day = 86400 = 170 subreddits per day
// requests per week = 1197 subreddits per week

// probably like 5000 subreddits in total with a decent amout of subscribers
// 5000 subreddits run once a week = 15000 requests per week (3 request per subreddit)

// Run subreddits on demand, only the most important first. The others can be
// on the backburner. Not all 5000 are that important.

// Maximum requests
  // per minute 60
  // per hour 3600
  // per day 86400
  // per week 604800


// Front end

const posts = [
  {
    name: 'about',
    type: 'info',
    path: ['about'],
    api: '/about'
  },

  // {
  //   name: 'rising',
  //   path: ['posts', 'rising'],
  //   api: '/rising'
  // },

  {
    name: 'weekly',
    path: ['posts', 'weekly'],
    api: '/top?t=week&limit=100'
  },

  {
    name: 'monthly',
    path: ['posts', 'monthly'],
    api: '/top?t=month&limit=100'
  },

  {
    name: 'hot',
    path: ['posts', 'hot'],
    api: '/hot?limit=100'
  },
  //
  // {
  //   name: 'topDaily',
  //   path: ['posts', 'top100_daily'],
  //   api: '/top?t=day&limit=100'
  // }
]

const userInfo = [
  {
    name: 'about',
    path: ['about'],
    api: '/about'
  },

  {
    name: 'top_100_submitted_in_past_month',
    path: ['posts', 'top100pastMonth'],
    api: '/submitted?limit=100&sort=top&t=month'
  },

  {
    name: 'top_100_comments_in_past_month',
    path: ['comments', 'top100pastMonth'],
    api: '/comments?limit=100&sort=top&t=month'
  },

  // {
  //   name: '20_recently_submitted',
  //   path: ['posts', 'recent20'],
  //   api: '/submitted?limit=20&sort=new'
  // },
  //
  // {
  //   name: '20_recently_commented',
  //   path: ['comments', 'recent20'],
  //   api: '/comments?limit=20&sort=top'
  // },


  // {
  //   name: 'upvoted',
  //   api: '/upvoted?limit=100'
  // },
  //
  // {
  //   name: 'downvoted',
  //   api: '/downvoted?limit=100'
  // }
]

// const get = async (baseURL, measurements, root) => {
//   // const promises = Promise.all(
//   //   measurements.map((measurement) => {
//   //     return api(baseURL + measurement.api)
//   //       .then((res) => Object.assign({}, res, { measurement: measurement.name }))
//   //   })
//   // )
//
//   return measurements.reduce(async (outputPromise, measurement) => {
//     const output = await outputPromise
//     const result = await api(baseURL + measurement.api)
//     return assocPath(measurement.path, result, output)
//   }, Promise.resolve(root))
//
//   // return promises.then((results) => {
//   //   return results.reduce((output, result) => {
//   //     const data = result.data.children.map((r) => Object.assign({}, r, {
//   //       measurement: result.measurement
//   //     }))
//   //
//   //     return output.concat(data)
//   //   }, [])
//   // })
// }

// const user = async (username) => {
//   const baseURL = `/user/${username}`
//   const result = await get(baseURL, userInfo, { name: username })
//
//   return result
// }
//
// const subreddit = async (name) => {
//   const baseURL = `/r/${name}`
//   const result = await get(baseURL, posts, { name })
//   // const uniquePosts = uniqWith((lhs, rhs) => lhs.data.id === rhs.data.id, results)
//
//   return result
// }

const DATA_DIR = join(__dirname, '..', '..', 'data')

const getSubreddit = async (subreddit) => {
  const posts = await getPosts(`/r/${subreddit}/hot?limit=25`)

  const postsWithComments = await Promise.all(posts.map(async (post) => {
    const post_comments = await getComments(`/r/${subreddit}/comments/${post.data.id}?depth=5&sort=top`)
    return Object.assign({}, post.data, { comments: post_comments })
  }))

  return { subreddit, posts: postsWithComments }
}

const getAll = async (subreddits) => {
  const subredditDataDir = join(DATA_DIR)

  ensureDirSync(subredditDataDir)
  emptyDirSync(subredditDataDir)

  const all = await Promise.all(subreddits.map((subreddit) => getSubreddit(subreddit)))

  all.forEach((data) => {
    writeFileSync(join(subredditDataDir, `${data.subreddit}.json`), JSON.stringify(data.posts, null, 2))
  })

  // const subData = await subreddit(name)
  // console.log(JSON.stringify(subData, null, 2))
  //
  // const posts = Object.keys(subData.posts).reduce((arr, key) => {
  //   const posts = subData.posts[key].data.children
  //   return arr.concat(posts)
  // }, [])
  //
  // const allAuthors = posts.map((post) => post.data.author)
  // const uniqueAuthors = uniq(allAuthors)
  // const topAuthors = uniqueAuthors.slice(0, 10)
  // const authors = await Promise.all(topAuthors.map((author) => user(author)))
  //
  // console.log(`/r/${name} - ${posts.length} posts by ${authors.length} authors. Took ${c} requests for all that information.`)
  // writeFileSync(join(subredditDataDir, 'data.json'), JSON.stringify(subData, null, 2))
  //
  // authors.forEach((authorData) => {
  //   writeFileSync(join(authorsDataDir, `${authorData.name}.json`), JSON.stringify(authorData, null, 2))
  // })



  // console.log(`Got ${posts.length} posts`)
  // subreddit(name).then((posts) => {
  //
  //
  //
  //   const authorUsernames = uniq(posts.map((post) => post.author)).slice(0, 10)
  //
  //   console.log(`Got ${authorUsernames.length} authors.`)
  //
  //   Promise.all(authorUsernames.map((author) => user(author).then((r) => Object.assign({ author, data: r })))).then((authors) => {
  //     console.log(`/r/${name} - ${posts.length} posts by ${authors.length} authors. Took ${c} requests for all that information.`)
  //     fs.writeFileSync(`${name}-posts`, JSON.stringify(posts, null, 2))
  //     fs.writeFileSync(`${name}-authors`, JSON.stringify(authors, null, 2))
  //   })
  // })
}


// For a subreddit /r/
  // Current Front Page Posts
  // Top 100 posts in the past week / month
  // Posts updated in the last hour - What's popular right now?
  // Rising posts
    // Title - What goes down well?
    // Content type - What type of content goes down well? Text, selfpost, post length, image, video?
    // Author - Who are the influencers?
      // Post History on this Sub - How do they post? What content can I create for them?
      // Other subs contributed to (in comment history) - Where else do they hang out?
    // Top commentors - Who else is influencing the thread?
      // Post History, Other Subs (like author)

  // Sticky / weekly posts - Is there somewhere I can regularly post to?
  // Most recent 100 posts (all time)
    // Time between posts - How active is this sub?
  // Moderators - Who moderates? Can I contact them for approval?
  // Wiki Contributors - Who contributes long-term content?
  // X-Posts, other subreddits mentioned in Sidebar, Wiki - Which subreddits share content with this one?

getAll(['soccer'])
