import {
 GraphQLString as StringType,
} from 'graphql';
// import getAll from 'ro-common/src/mongo/getAll';
import SubredditType from '../types/SubredditType';

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
    };
  },
});

export default subreddit;
