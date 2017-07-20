import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classes, { tile, grid } from './Grid.scss';

import { getTileId, getTileType } from 'src/helpers';

const Grid = ({ rows, columns, tiles }) => (
  <table className={grid}>
    <tbody>
      {
        new Array(rows).fill().map((_, rowIndex) => (
          <tr key={rowIndex}>
            {
              new Array(columns).fill().map((_, index) => (
                <td key={index} className={tile}>
                  <div
                    className={classes[
                      getTileType(tiles, getTileId(index, rowIndex, columns))
                    ]}
                  />
                </td>
              ))
            }
          </tr>
        ))
      }
    </tbody>
  </table>
);

Grid.propTypes = {
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
  tiles: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = ({ rows, columns, tiles }) => ({ rows, columns, tiles });

export default connect(mapStateToProps)(Grid);
