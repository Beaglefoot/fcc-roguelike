import { fromJS } from 'immutable';

import { convertTilesToMap } from '../helpers/grid';

export const GENERATE_GRID = 'GENERATE_GRID';

// grid looses it's type after returning from web worker
export const generateGrid = grid => {
  grid = fromJS(grid);
  const tiles = convertTilesToMap(grid.get('tiles'));

  return {
    type: GENERATE_GRID,
    grid: grid.set('tiles', tiles)
  };
};
