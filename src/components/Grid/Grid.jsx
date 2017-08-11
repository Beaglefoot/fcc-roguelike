import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import classes, { tile, grid } from './Grid.scss';

import { generateGrid, initPlayer } from '../../actions';
import GridWorker from './Grid_worker';
import Loading from '../Loading/Loading';
import Player from '../Player/Player';


class Grid extends React.PureComponent {
  componentDidMount() {
    const worker = new GridWorker();
    worker.postMessage('getGrid');
    worker.onmessage = ({ data }) => this.props.generateGrid(data);
  }

  componentDidUpdate() {
    const { player } = this.props;
    if (typeof player === 'undefined') this.props.initPlayer();
  }

  render() {
    const { rows, columns, tiles, player } = this.props;

    if (typeof tiles === 'undefined') return <Loading />;

    return (
      <table className={grid}>
        <tbody>
          {
            new Array(rows).fill().map((_, rowIndex) => (
              <tr key={rowIndex}>
                {
                  new Array(columns).fill().map((_, index) => {
                    const currentPosition = Map({ x: index, y: rowIndex });

                    return (
                      <td key={index} className={tile}>
                        <div
                          className={classes[
                            tiles.getIn([currentPosition, 'type'])
                          ]}
                        >
                          { typeof player !== 'undefined' && player.get('position').equals(currentPosition) && <Player /> }
                        </div>
                      </td>
                    );
                  })
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
  tiles: ImmutablePropTypes.map,
  player: ImmutablePropTypes.map
};

const mapStateToProps = state => {
  const { rows, columns, tiles, player } = state.toObject();
  return { rows, columns, tiles, player };
};

export default connect(mapStateToProps, { generateGrid, initPlayer })(Grid);
