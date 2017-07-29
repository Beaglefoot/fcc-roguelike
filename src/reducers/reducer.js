import { world } from '../config';
import { fromJS } from 'immutable';

import {
  generateTiles,
  createRoom
} from '../helpers/helpers';

const { rows, columns } = world;

const initialState = {
  rows,
  columns,
  tiles: createRoom(
    generateTiles(rows * columns, columns),
    fromJS([
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
    ])
  )
};



const reducer = (state = initialState, action) => {
  if (!action) return state;

  return state;
};

export default reducer;
