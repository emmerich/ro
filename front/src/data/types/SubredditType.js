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
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
} from 'graphql';
import TimeSeriesType from './TimeSeriesType';
import BarSeriesType from './BarSeriesType';
import PieChartType from './PieChartType';
import TableDataType from './TableDataType';

const SubredditType = new ObjectType({
  name: 'Subreddit',
  fields: {
    name: { type: StringType },
    subtitle: { type: StringType },
    numberOfSubscribers: { type: IntType },
    averageTimeSpentOnFrontPage: { type: FloatType },
    bestTimeToPost: { type: TimeSeriesType },
    topDomains: { type: BarSeriesType },
    percentageOfSelfPosts: { type: PieChartType },

    selfPostOrLink: {
      type: new ObjectType({
        name: 'SelfPostOrLink',
        fields: {
          percentageDifference: { type: PieChartType },
          postPosition: { type: TableDataType },
          numberOfUpvotes: { type: TableDataType },
        },
      }),
    },
  },
});

export default SubredditType;
