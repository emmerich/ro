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
import s from './TopDomains.css';
import { BarSeriesDatum } from '../../propTypes';

class TopDomains extends React.Component {

  static propTypes = {
    datum: BarSeriesDatum.isRequired,
  };

  componentDidMount() {
    const data = this.props.datum.data;

    const yExtent = d3fc.extentLinear()
      .include([0])
      .pad([0, 5])
      .padUnit('domain')
      .accessors([d => d.y]);

    const series = d3fc.seriesSvgBar()
      .mainValue(d => d.y);

    const chart = d3fc.chartSvgCartesian(
      d3.scalePoint(),
      d3.scaleLinear(),
    )
    .yDomain(yExtent(data))
    .xDomain(data.map(d => d.x))
    .xPadding(0.5);

    chart.plotArea(series);
    d3.select(`.${s.root}`)
      .datum(data)
      .call(chart);
    // END
  }

  render() {
    return <div className={s.root} />;
  }
}

export default withStyles(s)(TopDomains);
