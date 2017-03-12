import {
 GraphQLString as StringType,
} from 'graphql';
import SubredditType from '../types/SubredditType';
import bestTimeToPost from '../datum/bestTimeToPost';
import topDomains from '../datum/topDomains';
import selfPostOrLink from '../datum/selfPostOrLink';

const subreddit = () => ({
  type: SubredditType,

  args: {
    name: {
      type: StringType,
    },
  },

  async resolve(req, { name }) {
    return {
      name,
      subtitle: 'A subreddit about saying hello',
      numberOfSubscribers: Math.floor(Math.random() * 2000),
      averageTimeSpentOnFrontPage: Math.random() * 720,
      bestTimeToPost: await bestTimeToPost(),
      topDomains: await topDomains(),

      selfPostOrLink: await selfPostOrLink(),
    };
  },
});

export default subreddit;
