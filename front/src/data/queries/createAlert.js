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
import Alert from '../models/Alert';

const createAlert = {
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
    console.log('createAlert', term, subreddit);
    const alert = Alert.create({ term, subreddit });
    return alert;
  },
};

export default createAlert;
