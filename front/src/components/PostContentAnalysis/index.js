/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './style.css';
import TopDomains from '../../components/TopDomains';
import { BarSeriesDatum } from '../../propTypes';

export const PropTypes = {
  topDomains: BarSeriesDatum.isRequired,
};

class PostTitleAnalysis extends React.Component {

  static propTypes = PropTypes;

  render() {
    return (<section>
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
        <TopDomains datum={this.props.topDomains} />
        <h5>Average Upvotes per Domain</h5>
        <h5>Average Position per Domain</h5>
        <h5>Popular Content Types</h5>
        <h5>Average Upvotes per Content Type</h5>
        <h5>Average Position per Content Type</h5>
      </section>
    </section>);
  }
}

export default withStyles(s)(PostTitleAnalysis);
