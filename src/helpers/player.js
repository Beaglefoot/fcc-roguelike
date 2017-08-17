import { Map, List } from 'immutable';
import random from 'lodash/random';

import { getRandomMapValue } from '../helpers/common';

export const findKeyByCode = code => (
  {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    80: 'p'
  }[code]
);

export const getRandomPlacementPosition = state => {
  const playerPosition = state.getIn(['player', 'position']) || Map();
  const creaturePositions = (map => map ? map.mapKeys(k => k): Map())(state.get('creatures'));

  return Map(
    getRandomMapValue(
      state.get('tiles').filter((tile, key) => (
        tile.get('type') !== 'wall' &&
        !key.equals(playerPosition) &&
        !creaturePositions.has(key)
      ))
    ).get('position')
  );
};

export const isAreaRestricted = (state, position) => (
  state.getIn(['tiles', position, 'type']) === 'wall'
);

export const getAttackValue = attacker => random(...attacker.get('attack').toArray());

export const exchangeAttacks = (state, attacker = Map(), defender = Map()) => {
  defender = defender.update('hp', hp => hp - getAttackValue(attacker));
  if (defender.get('hp') > 0) attacker = attacker.update('hp', hp => hp - getAttackValue(defender));
  return state.set('player', attacker).setIn(['creatures', defender.get('position')], defender);
};

export const getRepositionedPlayer = (state, direction) => {
  const player = state.get('player');
  const shift = {
    left: { x: -1 },
    up: { y: -1 },
    right: { x: 1 },
    down: { y: 1 }
  }[direction];

  const newPosition = player.get('position').mergeWith((oldVal, newVal) => oldVal + newVal, Map(shift));

  if (isAreaRestricted(state, newPosition)) return state;
  else {
    const creature = state.getIn(['creatures', newPosition]);
    if (creature && creature.get('hp') > 0) return exchangeAttacks(state, player, creature);
    return state.setIn(['player', 'position'], newPosition);
  }
};

export const createPlayer = (state, levelSettings = Map()) => (
  Map({ position: getRandomPlacementPosition(state) })
    .concat(levelSettings, {
      hp: levelSettings.get('maxHP'),
      xp: 0,
      attack: levelSettings.get('baseAttack'),
      inventory: List(),
      equipped: Map({ weapon: Map(), armor: Map() })
    })
);
