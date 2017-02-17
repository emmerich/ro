import express from 'express';
import cors from 'cors'
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { groupBy, mapObjIndexed, pick, mean, reduce, sum, values, flatten, max, min, median,
  maxBy, minBy } from 'ramda'

const app = express();
app.use(cors());

const DATA_DIR = join(__dirname, '..', '..', 'data');

const sumObjects = (obj1, obj2) => {
  return mapObjIndexed((val, key, obj) => {
    return val + obj2[key]
  }, obj1)
}

const sumFields = (arr, fields) => {
  return arr.reduce((result, item) => {
    return sumObjects(result, pick(fields, item))
  }, )
  val.reduce((obj, post) => {
    return {
      count: val.length,
      ups: obj.ups + post.data.ups,
      downs: obj.downs + post.data.downs,
      score: obj.score + post.data.score
    }
  }, { ups: 0, downs: 0, score: 0 })
}


app.get('/:subreddit', (req, res) => {
  const subreddit = req.params.subreddit

  const dir = join(DATA_DIR, subreddit)
  const authorsDir = join(dir, 'authors')

  const data = JSON.parse(readFileSync(join(dir, 'data.json')));
  const authorFiles = readdirSync(authorsDir);
  const authors = authorFiles.map((file) => JSON.parse(readFileSync(join(authorsDir, file))));

  // name
  // number of subscribers
  // advertiser_category
  // submission type

  const allPosts = Object.keys(data.posts).reduce((arr, key) => {
    const posts = data.posts[key].data.children
    return arr.concat(posts)
  }, [])
  const numberOfPosts = allPosts.length

  const getContentType = (post) => {
    if(post.data.is_self) {
      return 'text'
    }

    if(post.data.media) {
      return post.data.media.oembed.type
    }

    // TODO analyze url
    return 'webpage'
  }

  const getContentTypes = (posts) => {
    return mapObjIndexed((posts) => posts.length, groupBy(getContentType, posts))
  }

  const domainStats = Object.keys(data.posts).reduce((obj, key) => {
    const posts = data.posts[key].data.children
    const byDomain = groupBy((post) => post.data.domain, posts)

    return Object.assign({}, obj, mapObjIndexed((posts, domain) => {
      return [].concat(posts, (obj[domain] || []))
    }, byDomain))
  }, {})

  const domains = {
    unique_domains: Object.keys(domainStats).length,
    total_posts: sum(values(mapObjIndexed((stats, domain) => stats.length, domainStats))),
    domain_stats: mapObjIndexed((posts, domain) => {
      const scores = posts.map((s) => s.data.score)
      const max_score = reduce(max, 0, scores)

      return {
        post_count: posts.length,
        average_score: mean(scores),
        max_score,
        min_score: reduce(min, max_score, scores),
        median_score: median(scores),
        content_types: getContentTypes(posts)
      }
    }, domainStats)
  }

  const _selfposts = Object.keys(data.posts).reduce((arr, key) => {
    const posts = data.posts[key].data.children
    return arr.concat(posts.filter((post) => post.data.is_self))
  }, [])

  const getStatistics = (arr) => {
    const max_val = reduce(max, 0, arr)

    return {
      count: arr.length,
      min: reduce(min, max_val, arr),
      max: max_val,
      average: mean(arr),
      median: median(arr)
    }
  }

  const getScoreStatistics = (arr) => {
    // TODO: rank the value in arr[0] based on the score in arr[1]
    const worst = minBy((i) => i[1])
    const best = maxBy((i) => i[1])

    return {
      best: reduce(best, [0, 0], arr)[0],
      worst: reduce(worst, [0, Infinity], arr)[0]
    }
  }

  const getWordCloud = (arr) => {
    const words = arr.reduce((res, text) => res.concat(text.split(' ')), []).map((word) => word.toLowerCase())

    return words.reduce((cloud, word) => {
      return Object.assign({}, cloud, {
        [word]: cloud[word] == null ? 1 : cloud[word] + 1
      })
    }, {})
  }

  const content_word_counts = _selfposts.map((post) => post.data.selftext.split(/[ \\t\\n]/).length)
  const content_word_counts_score = _selfposts.map((post) => [post.data.selftext.split(/[ \\t\\n]/).length, post.data.score])
  const title_word_counts = _selfposts.map((post) => post.data.title.split(/ /).length)
  const title_word_count_score = _selfposts.map((post) => [post.data.title.split(/ /).length, post.data.score])


  const selfposts = {
    count: _selfposts.length,
    percentage: (_selfposts.length / numberOfPosts) * 100,

    score: getStatistics(_selfposts.map((post) => post.data.score)),
    content_word_count: getStatistics(content_word_counts),
    content_word_count_score: getScoreStatistics(content_word_counts_score),

    title_word_count: getStatistics(title_word_counts),
    title_word_count_score: getScoreStatistics(title_word_count_score),

    // title_word_cloud: getWordCloud(_selfposts.map((post) => post.data.title)),
    // content_word_cloud: getWordCloud(_selfposts.map((post) => post.data.selftext))
  }

  // let c = 0
  // Object.keys(data.posts).forEach((key) => {
  //   return data.posts[key].data.children.forEach((post) => {
  //     // if(!post.data.domain) {
  //       c++
  //       console.log(post.data.domain)
  //     // }
  //   })
  // })
  // console.log(c)

  const influencers = authors.map((author) => {
    console.log(author)
    const allposts = Object.keys(author.posts).reduce((arr, key) => arr.concat(author.posts[key].data.children), [])
    const selfposts = allposts.filter((p) => p.data.is_self)

    const all_bySubreddit = groupBy((p) => p.data.subreddit, allposts)
    const self_bySubreddit = groupBy((p) => p.data.subreddit, selfposts)

    return {
      name: author.name,
      link_karma: author.about.data.link_karma,
      comment_karma: author.about.data.comment_karma,
      post_count: allposts.length,
      selfpost_count: selfposts.length,
      selfpost_percentage: (selfposts.length / allposts.length) * 100,
      other_subreddits: mapObjIndexed((arr) => arr.length, all_bySubreddit)
    }
  })

  const reddit = {
    name: data.name,
    subscribers: data.about.data.subscribers,
    advertiser_category: data.about.data.advertiser_category,
    submission_type: data.about.data.submission_type,

    content: {
      postCount: Object.keys(data.posts).reduce((sum, key) => {
        return data.posts[key].data.children.length + sum
      }, 0),

      domains,
      selfposts
    },

    influencers
  }



  res.json({ reddit })
})

app.listen(4000, () => console.log('Server running on http://localhost:4000'));
