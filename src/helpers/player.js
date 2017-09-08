import { Map, List } from 'immutable';
import random from 'lodash/random';

import { getRandomMapValue } from './common';
import { getSurroundingTileCoordinates } from './grid';
import { getCreaturesInRange } from './creatures';
import { visibilityRadius } from '../config/player';

export const findKeyByCode = code => (
  {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    72: 'h',
    80: 'p'
  }[code]
);

export const getRandomPlacementPosition = state => {
  const playerPosition = state.getIn(['player', 'position']) || Map();
  const creaturePositions = (map => map ? map.mapKeys(k => k) : Map())(state.get('creatures'));
  const itemPositions = (map => map ? map.mapKeys(k => k) : Map())(state.get('items'));
  const portalPosition = state.get('portal');

  return Map(
    getRandomMapValue(
      state.get('tiles').filter((tile, key) => (
        tile.get('type') === 'room' &&
        [ playerPosition, portalPosition ].every(pos => !key.equals(pos)) &&
        [ creaturePositions, itemPositions ].every(map => !map.has(key))
      ))
    ).get('position')
  );
};

export const isAreaRestricted = (tiles = Map(), position = Map()) => (
  tiles.getIn([position, 'type']) === 'wall'
);

export const getAttackValue = attacker => random(...attacker.get('attack').toArray());

export const calcDamage = (attack, protection) => (
  (rest => rest > 0 ? rest : 1)(attack - protection)
);

export const exchangeAttacks = (state, attacker = Map(), defender = Map()) => {
  defender = defender.update('hp', hp => (
    hp - calcDamage(getAttackValue(attacker), defender.get('protection'))
  ));
  if (defender.get('hp') > 0) attacker = attacker.update('hp', hp => (
    hp - calcDamage(getAttackValue(defender), attacker.get('protection'))
  ));
  return state.set('player', attacker).setIn(['creatures', defender.get('position')], defender);
};

export const getNewPosition = (player = Map(), direction) => {
  const shift = {
    left: { x: -1 },
    up: { y: -1 },
    right: { x: 1 },
    down: { y: 1 }
  }[direction];

  return player.get('position').mergeWith((oldVal, newVal) => oldVal + newVal, Map(shift));
};

export const isTileOccupiedByCreature = (creatures = Map(), position = Map()) => (
  creatures.has(position) && creatures.getIn([position, 'hp']) > 0
);

export const getRepositionedPlayer = (state, newPosition) => {
  const visibleTiles = getSurroundingTileCoordinates(
    newPosition,
    state.getIn(['player', 'visibilityRadius']),
    state.get('rows'),
    state.get('columns')
  );

  return state.update('player', player => (
    player
      .set('position', newPosition)
      .set('visibleTiles', visibleTiles)
      .set('creaturesInRange', getCreaturesInRange(state.get('creatures'), visibleTiles))
  ));
};

export const createPlayer = (state, levelSettings = Map()) => {
  const position = getRandomPlacementPosition(state);
  const visibleTiles = getSurroundingTileCoordinates(
    position,
    visibilityRadius,
    state.get('rows'),
    state.get('columns')
  );

  return Map({ position })
    .concat(levelSettings, {
      hp: levelSettings.get('maxHP'),
      xp: 0,
      attack: levelSettings.get('baseAttack'),
      protection: 0,
      inventory: List(),
      equipped: Map({ weapon: Map(), armor: Map() }),
      visibilityRadius,
      visibleTiles
    });
};

export const calcAttack = (baseAttack = List(), weapon = Map()) => (
  baseAttack.mergeWith((base, wep) => base + wep, weapon.get('damage'))
);

export const improvePlayerStats = (state, levelingTable) => {
  const player = state.get('player');
  const playerLevel = player.get('level');
  const newStats = levelingTable.get(playerLevel);

  return state.set(
    'player',
    player
      .merge(newStats)
      .set('hp', newStats.get('maxHP'))
      .set('attack', calcAttack(
        newStats.get('baseAttack'),
        player.getIn(['equipped', 'weapon']))
      )
  );
};

export const recalcBattleStats = (player = Map()) => (
  player
    .set(
      'attack',
      calcAttack(player.get('baseAttack'), player.getIn(['equipped', 'weapon']))
    )
    .set(
      'protection',
      player.getIn(['equipped', 'armor', 'protection']) || 0
    )
);

export const hasHealthPotion = (player = Map()) => (
  player.get('inventory').some(item => item.get('name').includes('Potion'))
);
