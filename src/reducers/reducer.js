import { Map, fromJS } from 'immutable';

import {
  GENERATE_GRID,
  INIT_PLAYER,
  MOVE_PLAYER,
  INIT_CREATURES,
  INIT_ITEMS,
  PICK_ITEM,
  USE_HEAL_POTION
} from '../actions';

import {
  getRepositionedPlayer,
  createPlayer
} from '../helpers/player';
import { populateWorld } from '../helpers/creatures';
import {
  scatterConsumables,
  placeItemIntoInventory,
  consumeHealthPotion
} from '../helpers/items';

import { levels as levelsObject } from '../config/levels';
import { creatures as creaturesObject } from '../config/creatures';
import { levelingTable as levelingTableObject } from '../config/player';
import { consumables as consumablesObject } from '../config/equipment';

const creatures = fromJS(creaturesObject);
const levels = fromJS(levelsObject);
const levelingTable = fromJS(levelingTableObject);
const consumables = fromJS(consumablesObject);


const reducer = (state = Map(), action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch(type) {
  case GENERATE_GRID:
    return state.merge(payload);
  case INIT_PLAYER:
    return state.set('player', createPlayer(state, levelingTable.get(0)));
  case MOVE_PLAYER:
    return getRepositionedPlayer(state, payload);
  case INIT_CREATURES:
    return populateWorld(
      state.set('creatures', Map()),
      levels.get(state.get('currentGameLevel') - 1),
      creatures
    );
  case INIT_ITEMS:
    return scatterConsumables(
      state.set('items', Map()),
      levels.get(state.get('currentGameLevel') - 1),
      consumables
    );
  case PICK_ITEM:
    return placeItemIntoInventory(state, payload);
  case USE_HEAL_POTION:
    return consumeHealthPotion(state);
  default:
    return state;
  }
};

export default reducer;
