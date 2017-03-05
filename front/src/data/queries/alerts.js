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
import AlertType from '../types/AlertType';
import Alert from '../models/Alert';

const alerts = {
  type: new ListType(AlertType),
  async resolve() {
    const all = await Alert.findAll();
    return all;
  },
};

export default alerts;
