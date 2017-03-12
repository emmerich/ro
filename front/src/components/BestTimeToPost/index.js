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
import { d3, d3fc } from '../../core/d3';
import s from './BestTimeToPost.css';
import { TimeSeriesDatum } from '../../propTypes';

class BestTimeToPost extends React.Component {

  static propTypes = {
    datum: TimeSeriesDatum.isRequired,
  };

  componentDidMount() {
    const data = this.props.datum.data;
    // const data = d3fc.randomFinancial()(50);
    console.log(JSON.stringify(data, null, 2))

    const yExtent = d3fc.extentLinear()
      .accessors([
        d => d.y,
      ])
      .pad([1, 1]);

    const xExtent = d3fc.extentDate()
      .accessors([d => d.x]);

    // const gridlines = d3fc.annotationSvgGridline();
    // const cartesian = d3fc.fc.chartSvgCartesian(
    //   d3.scaleLinear(),
    //   d3.scaleLinear());
    // const multi = d3fc.seriesSvgMulti()
    //     .series([cartesian]);

    const chart = d3fc.chartSvgCartesian(
        d3fc.scaleDiscontinuous(d3.scaleTime()),
        d3.scaleLinear(),
      )
      .yDomain(yExtent(data))
      .xDomain(xExtent(data));
      // .plotArea(multi);

    d3.select(`.${s.root}`)
      .datum(data)
      .call(chart);
  }

  render() {
    return <div className={s.root} />;
  }
}

export default withStyles(s)(BestTimeToPost);
