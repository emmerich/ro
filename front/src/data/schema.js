/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import alerts from './queries/alerts';
import createAlert from './queries/createAlert';

const schema = mongo => new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      alerts: alerts(mongo),
      createAlert: createAlert(mongo),
    },
  }),
});

export default schema;
