import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import classes, { tile, grid } from './Grid.scss';

import {
  generateGrid,
  initPlayer,
  movePlayer,
  initCreatures
} from '../../actions';

import { findKeyByCode } from '../../helpers/player';
import GridRow from './GridRow';
import GridWorker from './Grid_worker';
import Loading from '../Loading/Loading';
import Player from '../Player/Player';
import Creature from '../Creature/Creature';


class Grid extends React.PureComponent {
  constructor() {
    super();
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    const key = findKeyByCode(event.keyCode);
    if (key) this.props.movePlayer(key);
  }

  componentDidMount() {
    const worker = new GridWorker();
    worker.postMessage('getGrid');
    worker.onmessage = ({ data }) => this.props.generateGrid(data);

    addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.handleKeyPress);
  }

  componentDidUpdate() {
    const { player, initPlayer, creatures, initCreatures } = this.props;
    if (!creatures) initCreatures();
    else if (!player) initPlayer();
  }

  generateTile(tiles, rowIndex, playerPosition) {
    return (_, index) => {
      const currentPosition = Map({ x: index, y: rowIndex });
      const { x, y } = playerPosition.toObject();
      const { creatures } = this.props;
      const creatureAtCurrentTile = creatures && creatures.get(currentPosition);

      return (
        <td key={index} className={tile}>
          <div
            className={classes[
              tiles.getIn([currentPosition, 'type'])
            ]}
          >
            { x === index && y === rowIndex && <Player /> }
            { creatureAtCurrentTile && <Creature {...creatureAtCurrentTile.toObject()} /> }
          </div>
        </td>
      );
    };
  }

  generateRow(tiles, columns, playerPosition) {
    return (_, rowIndex) => (
      <GridRow key={rowIndex} rowIndex={rowIndex} playerRow={playerPosition.get('y')}>
        {
          new Array(columns).fill().map(this.generateTile(tiles, rowIndex, playerPosition))
        }
      </GridRow>
    );
  }

  render() {
    const { rows, columns, tiles, player } = this.props;

    if (!tiles) return <Loading />;
    const playerPosition = player ? player.get('position') : Map();

    return (
      <table className={grid}>
        <tbody>
          {
            new Array(rows).fill().map(this.generateRow(tiles, columns, playerPosition))
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
  const { rows, columns, tiles, player, creatures } = state.toObject();
  return { rows, columns, tiles, player, creatures };
};

const mapDispatchToProps = {
  generateGrid,
  initPlayer,
  movePlayer,
  initCreatures
};

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
