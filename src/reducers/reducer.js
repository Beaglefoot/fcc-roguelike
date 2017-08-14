import { Map } from 'immutable';

import {
  GENERATE_GRID,
  INIT_PLAYER,
  MOVE_PLAYER,
  INIT_CREATURES
} from '../actions';

import { repeatFunc } from '../helpers/common';

import {
  getRandomPlacementPosition,
  getRepositionedPlayer
} from '../helpers/player';

import { addCreatureToState } from '../helpers/creatures';

const reducer = (state = Map(), action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch(type) {
  case GENERATE_GRID:
    return state.merge(payload);
  case INIT_PLAYER:
    return state.set('player', Map({ position: getRandomPlacementPosition(state.get('tiles')) }));
  case MOVE_PLAYER:
    return state.set('player', getRepositionedPlayer(state, payload));
  case INIT_CREATURES:
    return repeatFunc(12, addCreatureToState, state.set('creatures', Map()));
  default:
    return state;
  }
};

export default reducer;
