/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const SubredditType = new ObjectType({
  name: 'Subreddit',
  fields: {
    name: { type: StringType },
  },
});

export default SubredditType;
