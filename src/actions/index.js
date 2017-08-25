import { Map, List, fromJS } from 'immutable';

import { convertTilesToMap } from '../helpers/grid';

export const GENERATE_GRID = 'GENERATE_GRID';
export const INIT_PLAYER = 'INIT_PLAYER';
export const MOVE_PLAYER = 'MOVE_PLAYER';
export const INIT_CREATURES = 'INIT_CREATURES';
export const INIT_ITEMS = 'INIT_ITEMS';
export const PICK_ITEM = 'PICK_ITEM';
export const USE_HEAL_POTION = 'USE_HEAL_POTION';
export const KILL_CREATURE = 'KILL_CREATURE';
export const LEVEL_UP = 'LEVEL_UP';
export const EQUIP_ITEM = 'EQUIP_ITEM';
export const ATTACK_CREATURE = 'ATTACK_CREATURE';

// grid looses it's type after returning from web worker
export const generateGrid = grid => {
  grid = fromJS(grid);
  const tiles = convertTilesToMap(grid.get('tiles'));

  return {
    type: GENERATE_GRID,
    payload: grid.set('tiles', tiles)
  };
};

export const initPlayer = () => ({ type: INIT_PLAYER });
export const movePlayer = (position = Map()) => ({ type: MOVE_PLAYER, payload: position });
export const initCreatures = () => ({ type: INIT_CREATURES });
export const initItems = () => ({ type: INIT_ITEMS });
export const pickItem = (items = Map(List())) => ({ type: PICK_ITEM, payload: items });
export const useHealPotion = (potion = Map()) => ({ type: USE_HEAL_POTION, payload: potion.size && potion });
export const killCreature = (creature = Map()) => ({ type: KILL_CREATURE, payload: creature });
export const levelUp = () => ({ type: LEVEL_UP });
export const equipItem = (item = Map()) => ({ type: EQUIP_ITEM, payload: item });
export const attackCreature = (creature = Map()) => ({ type: ATTACK_CREATURE, payload: creature });
