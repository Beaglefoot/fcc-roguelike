/* eslint no-unused-vars: off */
import { Map } from 'immutable';
import random from 'lodash/random';

import { getRandomMapValue } from '../helpers/common';

import {
  GENERATE_GRID,
  INIT_PLAYER,
  MOVE_PLAYER
} from '../actions';


const getRandomPlayerPosition = (tiles = Map()) => (
  Map(
    getRandomMapValue(
      tiles.filter(tile => tile.get('type') !== 'wall')
    ).get('position')
  )
);

const isAreaRestricted = (state, position) => (
  state.getIn(['tiles', position, 'type']) === 'wall'
);

const getRepositionedPlayer = (state, direction) => {
  const { player, tiles } = state.toObject();
  const shift = {
    left: { x: -1 },
    up: { y: -1 },
    right: { x: 1 },
    down: { y: 1 }
  }[direction];

  const newPosition = player.get('position').mergeWith((oldVal, newVal) => oldVal + newVal, Map(shift));
  return isAreaRestricted(state, newPosition) ? player : player.set('position', newPosition);
};


const reducer = (state = Map(), action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch(type) {
  case GENERATE_GRID:
    return state.merge(payload);
  case INIT_PLAYER:
    return state.set('player', Map({ position: getRandomPlayerPosition(state.get('tiles')) }));
  case MOVE_PLAYER:
    return state.set('player', getRepositionedPlayer(state, payload));
  default:
    return state;
  }
};

export default reducer;
