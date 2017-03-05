/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';
import graphql from '../../core/graphql';
import Layout from '../../components/Layout';

const createAlert = async (term, subreddit) => {
  console.log('createAlert', term, subreddit);

  const resp = await graphql({
    query: `query CreateAlert($term: String!, $subreddit: String!) {
        createAlert(term: $term, subreddit: $subreddit) {
          term,
          subreddit
        }
      }`,
    variables: {
      term,
      subreddit,
    },
  });

  const { data } = await resp.json();
  const created = data.createAlert;

  // How to refresh the component?
  window.location.reload();
};

export default {

  path: '/',

  async action() {
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{alerts{term,subreddit}}',
      }),
      credentials: 'include',
    });

    const { data } = await resp.json();
    if (!data || !data.alerts) throw new Error('Failed to load the news feed.');
    return {
      title: 'React Starter Kit',
      component: <Layout><Home
        alerts={data.alerts}
        createAlert={createAlert}
      /></Layout>,
    };
  },

};
