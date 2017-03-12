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
import { d3 } from '../../core/d3';
import s from './PercentageOfSelfPosts.css';
import { PieChartDatum } from '../../propTypes';

class PercentageOfSelfPosts extends React.Component {

  static propTypes = {
    datum: PieChartDatum.isRequired,
  };

  componentDidMount() {
    const data = this.props.datum.data;
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(['#98abc5', '#8a89a6']);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.size);

    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    const svg = d3.select(`.${s.root}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const g = svg.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', d => color(d.data.size));

    g.append('text')
      .attr('transform', d => `translate(${label.centroid(d)})`)
      .attr('dy', '.35em')
      .text(d => d.data.slice);
  }

  render() {
    return <div className={s.root} />;
  }
}

export default withStyles(s)(PercentageOfSelfPosts);
