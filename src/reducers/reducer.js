import { world } from '../config';
import { fromJS } from 'immutable';

import { generateTiles, getRoomCoordinates } from '../helpers/helpers';

const { rows, columns } = world;

const initialState = {
  rows,
  columns,
  tiles: generateTiles(rows * columns, columns)
    .map((tile, index) => index > 260 ? tile.merge({ type: 'room' }) : tile)
};


console.log(getRoomCoordinates(initialState.tiles, { x: 3, y: 3 }, 4, 5).toJS());



const reducer = (state = initialState, action) => {
  if (!action) return state;

  return state;
};

export default reducer;
