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
    averageTimeSpentOnFrontPage: { type: FloatType },
    bestTimeToPost: { type: TimeSeriesType },

    postTypeAnalysis: {
      type: new ObjectType({
        name: 'PostTypeAnalysis',
        fields: {
          percentageDifference: { type: PieChartType },
          postPosition: { type: TableDataType },
          numberOfUpvotes: { type: TableDataType },
        },
      }),
    },

    postTitleAnalysis: {
      type: new ObjectType({
        name: 'PostTitleAnalysis',
        fields: {
          test: { type: StringType },
        },
      }),
    },

    postContentAnalysis: {
      type: new ObjectType({
        name: 'PostContentAnalysis',
        fields: {
          topDomains: { type: BarSeriesType },
        },
      }),
    },
  },
});

export default SubredditType;
