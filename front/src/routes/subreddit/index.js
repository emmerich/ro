/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Subreddit from './Subreddit';
import graphql from '../../core/graphql';
import Layout from '../../components/Layout';

export default {

  path: '/r/:name',

  async action(req, { name }) {
    const resp = await graphql({
      query: `query GetSubreddit($name: String!) {
        subreddit(name: $name) {
          name,
          averageTimeSpentOnFrontPage,

          postTypeAnalysis {
            percentageDifference {
              data {
                slice,
                size
              }
            },

            postPosition {
              rows
            },

            numberOfUpvotes {
              rows
            }
          },

          postTitleAnalysis {
            test
          },

          postContentAnalysis {
            topDomains {
              data {
                x,
                y
              }
            }
          },

          bestTimeToPost {
            data {
              x,
              y
            }
          },
        }
      }`,
      variables: {
        name,
      },
    });

    const { data } = await resp.json();

    if (!data || !data.subreddit) throw new Error('Failed to load the news feed.');

    return {
      title: `/r/${data.subreddit.name}`,
      component: <Layout><Subreddit
        subreddit={data.subreddit}
      /></Layout>,
    };
  },

};
