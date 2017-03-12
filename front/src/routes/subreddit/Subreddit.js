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
import TopDomains from '../../components/TopDomains';
import SelfpostOrLink, { PropTypes as SelfPostOrLinkPropTypes } from './SelfpostOrLink';
import { TimeSeriesDatum, BarSeriesDatum } from '../../propTypes';

class Subreddit extends React.Component {
  static propTypes = {
    subreddit: PropTypes.shape({
      name: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
      numberOfSubscribers: PropTypes.number.isRequired,
      averageTimeSpentOnFrontPage: PropTypes.number.isRequired,
      bestTimeToPost: TimeSeriesDatum,
      topDomains: BarSeriesDatum,

      selfPostOrLink: SelfPostOrLinkPropTypes.isRequired,
    }).isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>/r/{this.props.subreddit.name} - {this.props.subreddit.subtitle}</h1>
          <section>
            <section>
              <h3>Number of Subscribers</h3>
              <div>{this.props.subreddit.numberOfSubscribers}</div>
            </section>
            <section>
              <h3>Average Time Spent on Front page</h3>
              <div>{this.props.subreddit.averageTimeSpentOnFrontPage} minutes</div>
            </section>
          </section>

          <section>
            <h2>Post Type</h2>
            <SelfpostOrLink {...this.props.subreddit.selfPostOrLink} />
          </section>

          <section>
            <h2>Creating a Post</h2>
            <section>
              <h3>Post Title</h3>
              <h4>Average Title Length</h4>
              <h4>Popular keywords</h4>
            </section>
            <section>
              <h3>Post Content</h3>
              <section>
                <h4>Self-post</h4>
                <h5>Average Content Length</h5>
                <h5>Popular keywords</h5>
                <h5>Average number of external links</h5>
              </section>
              <section>
                <h4>Link</h4>
                <h5>Popular Domains</h5>
                <TopDomains datum={this.props.subreddit.topDomains} />
                <h5>Average Upvotes per Domain</h5>
                <h5>Average Position per Domain</h5>
                <h5>Popular Content Types</h5>
                <h5>Average Upvotes per Content Type</h5>
                <h5>Average Position per Content Type</h5>
              </section>
            </section>
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
