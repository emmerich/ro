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
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const AlertType = new ObjectType({
  name: 'Alert',
  fields: {
    id: { type: new NonNull(ID) },
    term: { type: new NonNull(StringType) },
    subreddit: { type: StringType },
  },
});

export default AlertType;
