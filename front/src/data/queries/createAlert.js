/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
 GraphQLString as StringType,
} from 'graphql';
import AlertType from '../types/AlertType';

const createAlert = mongo => ({
  type: AlertType,
  args: {
    term: {
      type: StringType,
    },

    subreddit: {
      type: StringType,
    },
  },
  async resolve(req, { term, subreddit }) {
    const templates = mongo.collection('templates');
    return templates.insert({ term, subreddits: [subreddit] });
  },
});

export default createAlert;
