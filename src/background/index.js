import fetch from 'node-fetch'
import FormData from 'form-data'
import { writeFileSync, ensureDirSync, emptyDirSync } from 'fs-extra'
import { uniq, flatten, uniqWith, assocPath, omit, pick } from 'ramda'
import { join } from 'path'

let id = "6mP7uxSzgb3MFuyc8I8OlT8vcDk"

const refreshID = async () => {
  console.log('Refreshing reddit ID')
  // const body = new FormData()
  // body.append('grant_type', 'client_credentials')

  // console.log('Body', body)

  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'post',
    headers: {
      'User-Agent': 'JohnnyBravo/0.1 by JBTopGuy',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic N1B0RU93Rkk5OUJ2OFE6RE1RR2x1WG16SnFINjZzNU1fU3cwMS1mLUQ4'
    },
    body: 'grant_type=client_credentials'
  })

  console.log('res', res.status)
  const json = await res.json()
  console.log('res', json)
  id = json.access_token
//   {
//   "access_token": "n9prJuEEYfSosXxqLlhn_ljic5U",
//   "token_type": "bearer",
//   "expires_in": 3600,
//   "scope": "*"
// }
}

const get = async (url) => {
  let actualURL = `https://oauth.reddit.com${url}`

  console.log('get', id)
  const res = await fetch(actualURL, {
    headers: {
      'Authorization': `bearer ${id}`,
      'User-Agent': "JohnnyBravo/0.1 by JBTopGuy"
    }
  })

  console.log(actualURL, res.status)

  if(res.status === 401) {
    // ID has expired, need a new one.
    await refreshID()
    return get(url)
  }

  return res.json()
}

const getPosts = async (url) => {
  const resp = await get(url)
  return resp.data.children.map((post) => post.data)
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


const DATA_DIR = join(__dirname, '..', '..', 'data')

const getSubreddit = async (subreddit) => {
  const posts = await getPosts(`/r/${subreddit}/hot?limit=25`)

  const postsWithComments = await Promise.all(posts.map(async (post) => {
    const post_comments = await getComments(`/r/${subreddit}/comments/${post.id}?depth=5&sort=top`)
    return Object.assign({}, post, { comments: post_comments })
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

const subreddits = ['soccer']
getAll(subreddits)
setInterval(() => getAll(subreddits), 1000 * 60 * 60)
