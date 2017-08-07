import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import classes, { tile, grid } from './Grid.scss';

import { getTile } from 'src/helpers/grid';
import { generateGrid } from '../../actions';
import GridWorker from './Grid_worker';


class Grid extends React.Component {
  componentDidMount() {
    const worker = new GridWorker();
    worker.postMessage('getGrid');
    worker.onmessage = e => {
      const tiles = fromJS(e.data.tiles);
      this.props.generateGrid({ ...e.data, tiles });
    };
  }

  render() {
    const { rows, columns, tiles } = this.props;

    if (typeof tiles === 'undefined') return <div>Loading...</div>;

    return (
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
                          getTile(tiles, { x: index, y: rowIndex }).get('type')
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
  }
}

Grid.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  tiles: ImmutablePropTypes.listOf(ImmutablePropTypes.map)
};

const mapStateToProps = ({ rows, columns, tiles }) => ({ rows, columns, tiles });

export default connect(mapStateToProps, { generateGrid })(Grid);
