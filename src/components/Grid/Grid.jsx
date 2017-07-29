import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
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
                      getTileType(tiles, { x: index, y: rowIndex })
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
  tiles: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired
};

const mapStateToProps = state => ({ ...state.toObject() });

export default connect(mapStateToProps)(Grid);
