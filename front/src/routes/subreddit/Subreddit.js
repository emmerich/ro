/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Subreddit.css';
import BestTimeToPost from '../../components/BestTimeToPost';

import PostTypeAnalysis, { PropTypes as PostTypeAnalysisPropTypes } from '../../components/PostTypeAnalysis';
import PostTitleAnalysis, { PropTypes as PostTitleAnalysisPropTypes } from '../../components/PostTitleAnalysis';
import PostContentAnalysis, { PropTypes as PostContentAnalysisPropTypes } from '../../components/PostContentAnalysis';

import { TimeSeriesDatum } from '../../propTypes';

class Subreddit extends React.Component {
  static propTypes = {
    subreddit: PropTypes.shape({
      name: PropTypes.string.isRequired,
      averageTimeSpentOnFrontPage: PropTypes.number.isRequired,
      bestTimeToPost: TimeSeriesDatum,

      postTitleAnalysis: PostTitleAnalysisPropTypes.isRequired,
      postTypeAnalysis: PostTypeAnalysisPropTypes.isRequired,
      postContentAnalysis: PostContentAnalysisPropTypes.isRequired,
    }).isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>/r/{this.props.subreddit.name}</h1>
          <section>
            <section>
              <h3>Average Time Spent on Front page</h3>
              <div>{this.props.subreddit.averageTimeSpentOnFrontPage} minutes</div>
            </section>
          </section>

          <section>
            <h2>Post Type</h2>
            <PostTypeAnalysis {...this.props.subreddit.postTypeAnalysis} />
          </section>

          <section>
            <h2>Creating a Post</h2>
            <PostTitleAnalysis {...this.props.subreddit.postTitleAnalysis} />
            <PostContentAnalysis {...this.props.subreddit.postContentAnalysis} />
          </section>

          <section>
            <h2>Posting</h2>

            <section>
              <h3>Best Time to Post</h3>
              <BestTimeToPost datum={this.props.subreddit.bestTimeToPost} />
              <h3>Post with RedditLater</h3>
            </section>
          </section>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Subreddit);
