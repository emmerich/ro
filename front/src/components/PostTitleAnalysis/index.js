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

export const PropTypes = {};

class PostTitleAnalysis extends React.Component {

  static propTypes = PropTypes;

  render() {
    return (<section>
      <h3>Post Title</h3>
      <h4>Average Title Length</h4>

      <h4>Popular keywords</h4>
    </section>);
  }
}

export default withStyles(s)(PostTitleAnalysis);
