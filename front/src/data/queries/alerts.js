/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
 GraphQLList as ListType,
} from 'graphql';
import getAll from 'ro-common/src/mongo/getAll';
import AlertType from '../types/AlertType';

const alerts = mongo => ({
  type: new ListType(AlertType),
  async resolve() {
    const templates = mongo.collection('templates');
    return getAll(templates);
  },
});

export default alerts;
