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
import s from './ComparisonTable.css';
import TableData from '../../propTypes/TableData';

class ComparisonTable extends React.Component {

  static propTypes = {
    data: TableData.isRequired,
  };

  render() {
    return (<table>
      <thead>
        <tr>
          <th />
          <th>Min</th>
          <th>Max</th>
          <th>Average</th>
        </tr>
      </thead>
      <tbody>
        {
          this.props.data.rows.map(row => (<tr>
            { row.map(cell => <td>{cell}</td>) }
          </tr>))
        }
      </tbody>
    </table>);
  }
}

export default withStyles(s)(ComparisonTable);
