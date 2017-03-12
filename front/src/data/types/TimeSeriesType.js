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
  GraphQLList as ListType,
  GraphQLFloat as FloatType,
} from 'graphql';

const DataPointType = new ObjectType({
  name: 'TimeSeriesPoint',
  fields: {
    x: { type: FloatType },
    y: { type: FloatType },
  },
});

const TimeSeriesType = new ObjectType({
  name: 'TimeSeries',
  fields: {
    data: { type: new ListType(DataPointType) },
  },
});

export default TimeSeriesType;
