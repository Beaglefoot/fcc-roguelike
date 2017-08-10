/* eslint no-unused-vars: off */
import { Map } from 'immutable';
import random from 'lodash/random';

import { getRandomMapValue } from '../helpers/common';

import {
  GENERATE_GRID,
  INIT_PLAYER
} from '../actions';


const getRandomPlayerPosition = (tiles = Map()) => (
  Map(
    getRandomMapValue(
      tiles.filter(tile => tile.get('type') !== 'wall')
    ).get('position')
  )
);


const reducer = (state = Map(), action) => {
  if (!action) return state;

  switch(action.type) {
  case GENERATE_GRID:
    return state.merge(action.grid);
  case INIT_PLAYER:
    return state.set('player', Map({ position: getRandomPlayerPosition(state.get('tiles')) }));
  default:
    return state;
  }
};

export default reducer;
