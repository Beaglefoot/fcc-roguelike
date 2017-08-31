import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import throttle from 'lodash/throttle';
import pick from 'lodash/pick';

import classes, { tile, grid } from './Grid.scss';

import {
  generateGrid,
  initPlayer,
  movePlayer,
  initCreatures,
  initItems,
  pickItem,
  useHealPotion,
  attackCreature,
  killCreature
} from '../../actions';

import {
  findKeyByCode,
  isAreaRestricted,
  getNewPosition,
  isTileOccupiedByCreature
} from '../../helpers/player';
import GridRow from './GridRow';
import Loading from '../Loading/Loading';
import Player from '../Player/Player';
import Creature from '../Creature/Creature';


class Grid extends React.PureComponent {
  constructor() {
    super();
    this.state = { playerJustMounted: true };
    this.handleKeyPress = throttle(this.handleKeyPress.bind(this), 200);
  }

  handleKeyPress(event) {
    const {
      movePlayer,
      pickItem,
      player,
      items,
      useHealPotion,
      tiles,
      creatures,
      attackCreature
    } = this.props;
    const key = findKeyByCode(event.keyCode);

    if (!key) return;

    const playerPosition = player.get('position');

    if (key === 'p') {
      const itemsHere = items.get(playerPosition) || List();
      if (itemsHere.size) pickItem(Map().set(playerPosition, itemsHere));
    }
    else if (key === 'h') useHealPotion();
    else {
      const newPosition = getNewPosition(player, key);

      if (isTileOccupiedByCreature(creatures, newPosition)) attackCreature(creatures.get(newPosition));
      else if (!isAreaRestricted(tiles, newPosition)) movePlayer(newPosition);
    }
  }

  componentDidMount() {
    this.props.generateGrid();
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.handleKeyPress);
  }

  componentDidUpdate() {
    const {
      player,
      initPlayer,
      creatures,
      initCreatures,
      items,
      initItems,
      killCreature,
      tiles
    } = this.props;

    if (tiles) {
      if (!creatures) initCreatures();
      else {
        const creatureToKill = creatures.find(creature => (
          creature.get('hp') <= 0 && !creature.get('isDead')
        ));
        if (creatureToKill) killCreature(creatureToKill);
      }

      if (!items) initItems();
      // 'else' is here to make sure player render is the last.
      // With a player on map only closest rows of a grid render.
      else if (!player) {
        /* eslint react/no-did-update-set-state: off */
        this.setState({ playerJustMounted: true });

        initPlayer();
        addEventListener('keydown', this.handleKeyPress);
        setTimeout(() => this.setState({ playerJustMounted: false }), 5000);
      }

      if (player && player.get('hp') <= 0) removeEventListener('keydown', this.handleKeyPress);
    }
  }

  generateTile(tiles, rowIndex, playerPosition) {
    return (_, index) => {
      const currentPosition = Map({ x: index, y: rowIndex });
      const { x, y } = playerPosition.toObject();
      const { creatures, items } = this.props;
      const creatureAtCurrentTile = creatures && creatures.get(currentPosition);
      const itemsAtCurrentTile = items && items.get(currentPosition);

      return (
        <td key={index} className={tile}>
          <div
            className={classes[
              tiles.getIn([currentPosition, 'type'])
            ]}
          >
            { x === index && y === rowIndex && <Player justMounted={this.state.playerJustMounted} /> }
            { creatureAtCurrentTile && <Creature creature={creatureAtCurrentTile} /> }
            { itemsAtCurrentTile && '!' }
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

const mapStateToProps = state => (
  pick(state.toObject(), ['rows', 'columns', 'tiles', 'player', 'creatures', 'items'])
);

const mapDispatchToProps = {
  generateGrid,
  initPlayer,
  movePlayer,
  initCreatures,
  initItems,
  pickItem,
  useHealPotion,
  attackCreature,
  killCreature
};

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
