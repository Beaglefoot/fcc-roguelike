import { Map, fromJS } from 'immutable';

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
export const movePlayer = direction => ({ type: MOVE_PLAYER, payload: direction });
export const initCreatures = () => ({ type: INIT_CREATURES });
export const initItems = () => ({ type: INIT_ITEMS });
export const pickItem = (item = Map()) => ({ type: PICK_ITEM, payload: item });
export const useHealPotion = () => ({ type: USE_HEAL_POTION });
export const killCreature = (creature = Map()) => ({ type: KILL_CREATURE, payload: creature });
export const levelUp = () => ({ type: LEVEL_UP });
