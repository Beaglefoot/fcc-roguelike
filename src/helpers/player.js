import { Map, List } from 'immutable';
import random from 'lodash/random';

import { getRandomMapValue } from '../helpers/common';

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

export const calcDamage = (attack, protection) => (
  (rest => rest > 0 ? rest : 1)(attack - protection)
);

export const exchangeAttacks = (state, attacker = Map(), defender = Map()) => {
  defender = defender.update('hp', hp => (
    hp - calcDamage(getAttackValue(attacker), defender.get('protection'))
  ));
  if (defender.get('hp') > 0) attacker = attacker.update('hp', hp => (
    hp - calcDamage(getAttackValue(defender), defender.get('protection'))
  ));
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
      protection: 0,
      inventory: List(),
      equipped: Map({ weapon: Map(), armor: Map() })
    })
);

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
