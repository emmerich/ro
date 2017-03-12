import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PercentageOfSelfPosts from '../PercentageOfSelfPosts';
import ComparisonTable from '../ComparisonTable';
import { TableData, PieChartDatum } from '../../propTypes';
import s from './style.css';

export const PropTypes = {
  percentageDifference: PieChartDatum.isRequired,
  postPosition: TableData.isRequired,
  numberOfUpvotes: TableData.isRequired,
};

class PostTypeAnalysis extends React.Component {

  static propTypes = PropTypes;

  render() {
    return (
      <section>
        <h3>Self-post vs. Link</h3>
        <section className={s.container}>
          <section className={s.lhs}>
            <PercentageOfSelfPosts datum={this.props.percentageDifference} />
          </section>
          <section className={s.rhs}>
            <section>
              <h4>Post Position</h4>
              <ComparisonTable data={this.props.postPosition} />
            </section>
            <section>
              <h4>Number of Upvotes</h4>
              <ComparisonTable data={this.props.numberOfUpvotes} />
            </section>
          </section>
        </section>
      </section>
    );
  }
}

export default withStyles(s)(PostTypeAnalysis);
