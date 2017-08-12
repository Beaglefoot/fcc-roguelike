import { fromJS } from 'immutable';

import { convertTilesToMap } from '../helpers/grid';

export const GENERATE_GRID = 'GENERATE_GRID';
export const INIT_PLAYER = 'INIT_PLAYER';
export const MOVE_PLAYER = 'MOVE_PLAYER';
export const INIT_CREATURES = 'INIT_CREATURES';

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
