import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import classes, { tile, grid } from './Grid.scss';

import { generateGrid } from '../../actions';
import GridWorker from './Grid_worker';
import Loading from '../Loading/Loading';


class Grid extends React.PureComponent {
  componentDidMount() {
    const worker = new GridWorker();
    worker.postMessage('getGrid');
    worker.onmessage = ({ data }) => this.props.generateGrid(data);
  }

  render() {
    const { rows, columns, tiles } = this.props;

    if (typeof tiles === 'undefined') return <Loading />;

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
                          tiles.getIn([Map({ x: index, y: rowIndex }), 'type'])
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
  tiles: ImmutablePropTypes.map
};

const mapStateToProps = state => {
  const { rows, columns, tiles } = state.toObject();
  return { rows, columns, tiles };
};

export default connect(mapStateToProps, { generateGrid })(Grid);
