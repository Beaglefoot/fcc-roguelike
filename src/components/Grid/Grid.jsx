import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import throttle from 'lodash/throttle';
import pick from 'lodash/pick';
import classNames from 'classnames';

import classes, { tile, grid, dimOverlay, dimBorder } from './Grid.scss';

import {
  generateWorld,
  initPlayer,
  movePlayer,
  initCreatures,
  initItems,
  pickItem,
  useHealPotion,
  attackCreature,
  killCreature,
  initPortal,
  teleportToNextLevel
} from '../../actions';

import {
  findKeyByCode,
  isAreaRestricted,
  getNewPosition,
  isTileOccupiedByCreature,
  hasHealthPotion
} from '../../helpers/player';

import GridRow from './GridRow';
import Loading from '../Loading/Loading';
import Player from '../Player/Player';
import Creature from '../Creature/Creature';


class Grid extends React.PureComponent {
  constructor() {
    super();
    this.state = { playerJustMounted: true };
    this.handleKeyPress = throttle(this.handleKeyPress.bind(this), 120);
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
      attackCreature,
      lastAction
    } = this.props;
    const key = findKeyByCode(event.keyCode);

    if (!key || !player || lastAction.get('type') === 'WIN_GAME') return;

    const playerPosition = player.get('position');

    if (key === 'p') {
      const itemsHere = items.get(playerPosition) || List();
      if (itemsHere.size) pickItem(Map().set(playerPosition, itemsHere));
    }
    else if (key === 'h') hasHealthPotion(player) && useHealPotion();
    else {
      const newPosition = getNewPosition(player, key);

      if (isTileOccupiedByCreature(creatures, newPosition)) attackCreature(creatures.get(newPosition));
      else if (!isAreaRestricted(tiles, newPosition)) movePlayer(newPosition);
    }
  }

  componentDidMount() {
    this.props.generateWorld();
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.handleKeyPress);
  }

  componentDidUpdate(prevProps) {
    const {
      player,
      creatures,
      killCreature,
      portal,
      teleportToNextLevel
    } = this.props;

    if (creatures) {
      const creatureToKill = creatures.find(creature => (
        creature.get('hp') <= 0 && !creature.get('isDead')
      ));
      if (creatureToKill) killCreature(creatureToKill);
    }

    if (player) {
      if (!prevProps.player) {
        /* eslint react/no-did-update-set-state: off */
        this.setState({ playerJustMounted: true });

        addEventListener('keydown', this.handleKeyPress);
        setTimeout(() => this.setState({ playerJustMounted: false }), 5000);
      }

      if (player.get('hp') <= 0) removeEventListener('keydown', this.handleKeyPress);
      if (player.get('position').equals(portal)) teleportToNextLevel();
    }
  }

  generateTile(tiles, rowIndex) {
    return (_, index) => {
      const currentPosition = Map({ x: index, y: rowIndex });
      const currentTile = tiles.get(currentPosition).toObject();
      const { x, y } = this.playerPosition.toObject();
      const { creatures, items, portal } = this.props;
      const creatureAtCurrentTile = creatures && creatures.get(currentPosition);
      const itemsAtCurrentTile = items && items.get(currentPosition);

      return (
        <td key={index} className={tile}>
          <div
            className={classNames(
              classes[currentTile.type],
              { [dimBorder]: !currentTile.visible }
            )}
            style={{ opacity: currentTile.opacity || 1 }}
          >
            {
              !currentTile.visible ? <div className={dimOverlay} />
                : (x === index && y === rowIndex) ? <Player justMounted={this.state.playerJustMounted} />
                  : creatureAtCurrentTile ? <Creature creature={creatureAtCurrentTile} />
                    : itemsAtCurrentTile ? '!'
                      : (portal && portal.equals(currentPosition)) && '^'
            }
          </div>
        </td>
      );
    };
  }

  generateRow(tiles, columns) {
    return (_, rowIndex) => (
      <GridRow
        key={rowIndex}
        rowIndex={rowIndex}
        playerRow={this.playerPosition.get('y')}
        visibilityRadius={this.visibilityRadius}
      >
        {
          new Array(columns).fill().map(this.generateTile(tiles, rowIndex))
        }
      </GridRow>
    );
  }

  render() {
    const { rows, columns, player, className } = this.props;
    let { tiles } = this.props;

    if (!tiles) return <Loading className={className} />;
    this.playerPosition = player ? player.get('position') : Map();
    this.visibilityRadius = player ? player.get('visibilityRadius') : 0;

    if (player) tiles = player.get('visibleTiles')
      .reduce((tiles, tile) => tiles.setIn([tile, 'visible'], true), tiles);

    return (
      <table className={classNames(grid, className)}>
        <tbody>
          {
            new Array(rows).fill().map(this.generateRow(tiles, columns))
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
  player: ImmutablePropTypes.map,
  creatures: ImmutablePropTypes.map,
  items: ImmutablePropTypes.map,
  portal: ImmutablePropTypes.map,
  className: PropTypes.string
};

const mapStateToProps = state => (
  pick(
    state.toObject(),
    ['rows', 'columns', 'tiles', 'player', 'creatures', 'items', 'portal', 'lastAction']
  )
);

const mapDispatchToProps = {
  generateWorld,
  initPlayer,
  movePlayer,
  initCreatures,
  initItems,
  pickItem,
  useHealPotion,
  attackCreature,
  killCreature,
  initPortal,
  teleportToNextLevel
};

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
