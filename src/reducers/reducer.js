import { Map, fromJS } from 'immutable';

import {
  GENERATE_GRID,
  INIT_PLAYER,
  MOVE_PLAYER,
  INIT_CREATURES,
  INIT_ITEMS,
  PICK_ITEM,
  USE_HEAL_POTION,
  KILL_CREATURE,
  LEVEL_UP,
  EQUIP_ITEM,
  ATTACK_CREATURE
} from '../actions';

import {
  getRepositionedPlayer,
  createPlayer,
  improvePlayerStats,
  exchangeAttacks
} from '../helpers/player';
import { populateWorld, creatureDies } from '../helpers/creatures';
import {
  scatterConsumables,
  placeItemIntoInventory,
  consumeHealthPotion,
  equipItem
} from '../helpers/items';

import { levels as levelsObject } from '../config/levels';
import { creatures as creaturesObject } from '../config/creatures';
import { levelingTable as levelingTableObject } from '../config/player';
import { consumables as consumablesObject } from '../config/equipment';

const creatures = fromJS(creaturesObject);
const levels = fromJS(levelsObject);
const levelingTable = fromJS(levelingTableObject);
const consumables = fromJS(consumablesObject);


const reducer = (state = Map(), { type, payload } = {}) => {
  const newState = type ? state.set('lastAction', Map({ type, payload })) : state;
  console.log('reducer:', newState.getIn(['lastAction', 'type']));

  switch(type) {
  case GENERATE_GRID:
    return newState.merge(payload);
  case INIT_PLAYER:
    return newState.set('player', createPlayer(newState, levelingTable.get(0)));
  case MOVE_PLAYER:
    return getRepositionedPlayer(newState, payload);
  case INIT_CREATURES:
    return populateWorld(
      newState.set('creatures', Map()),
      levels.get(newState.get('currentGameLevel') - 1),
      creatures
    );
  case INIT_ITEMS:
    return scatterConsumables(
      newState.set('items', Map()),
      levels.get(newState.get('currentGameLevel') - 1),
      consumables
    );
  case PICK_ITEM:
    return placeItemIntoInventory(newState, payload);
  case USE_HEAL_POTION:
    return consumeHealthPotion(newState, payload);
  case KILL_CREATURE:
    return creatureDies(newState, payload);
  case LEVEL_UP:
    return improvePlayerStats(newState, levelingTable);
  case EQUIP_ITEM:
    return equipItem(newState, payload);
  case ATTACK_CREATURE:
    return exchangeAttacks(newState, newState.get('player'), payload);
  default:
    return newState;
  }
};

export default reducer;
