import {
 GraphQLString as StringType,
} from 'graphql';
import SubredditType from '../types/SubredditType';
import bestTimeToPost from '../datum/bestTimeToPost';
import postTypeAnalysis from '../datum/postTypeAnalysis';
import postTitleAnalysis from '../datum/postTitleAnalysis';
import postContentAnalysis from '../datum/postContentAnalysis';

const subreddit = () => ({
  type: SubredditType,

  args: {
    name: {
      type: StringType,
    },
  },

  async resolve(req, { name }) {
    const data = {
      name,
      averageTimeSpentOnFrontPage: Math.random() * 720,
      bestTimeToPost: await bestTimeToPost(),

      postTypeAnalysis: await postTypeAnalysis(),
      postTitleAnalysis: await postTitleAnalysis(),
      postContentAnalysis: await postContentAnalysis(),
    };

    return data;
  },
});

export default subreddit;
