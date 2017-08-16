import { Map, fromJS } from 'immutable';

import {
  GENERATE_GRID,
  INIT_PLAYER,
  MOVE_PLAYER,
  INIT_CREATURES
} from '../actions';

import {
  getRepositionedPlayer,
  createPlayer
} from '../helpers/player';
import { populateWorld } from '../helpers/creatures';

import { levels as levelsObject } from '../config/levels';
import { creatures as creaturesObject } from '../config/creatures';
import { levelingTable as levelingTableObject } from '../config/player';

const creatures = fromJS(creaturesObject);
const levels = fromJS(levelsObject);
const levelingTable = fromJS(levelingTableObject);


const reducer = (state = Map(), action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch(type) {
  case GENERATE_GRID:
    return state.merge(payload);
  case INIT_PLAYER:
    return state.set('player', createPlayer(state, levelingTable.get(0)));
  case MOVE_PLAYER:
    return state.set('player', getRepositionedPlayer(state, payload));
  case INIT_CREATURES:
    return populateWorld(
      state.set('creatures', Map()),
      levels.get(state.get('currentGameLevel') - 1),
      creatures
    );
  default:
    return state;
  }
};

export default reducer;
