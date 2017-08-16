import { Map } from 'immutable';

import { getRandomMapValue } from '../helpers/common';

export const findKeyByCode = code => (
  {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
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

export const getRepositionedPlayer = (state, direction) => {
  const { player } = state.toObject();
  const shift = {
    left: { x: -1 },
    up: { y: -1 },
    right: { x: 1 },
    down: { y: 1 }
  }[direction];

  const newPosition = player.get('position').mergeWith((oldVal, newVal) => oldVal + newVal, Map(shift));
  return isAreaRestricted(state, newPosition) ? player : player.set('position', newPosition);
};

export const createPlayer = (state, levelSettings = Map()) => (
  Map({ position: getRandomPlacementPosition(state) })
    .concat(levelSettings)
    .concat({ hp: levelSettings.get('maxHP') })
);
