import React from 'react';
import { connect } from 'react-redux';

import { cell, grid } from './Grid.scss';

const Grid = props => (
  <table className={grid}>
    <tbody>
      {
        new Array(props.rows).fill().map((_, index) => (
          <tr key={index}>
            {
              new Array(props.columns).fill().map((_, index) => (
                <td key={index} className={cell} />
              ))
            }
          </tr>
        ))
      }
    </tbody>
  </table>
);

const mapStateToProps = ({ rows, columns }) => ({ rows, columns });

export default connect(mapStateToProps)(Grid);
