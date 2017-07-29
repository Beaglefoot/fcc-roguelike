import { world } from '../config';
import { fromJS } from 'immutable';

import { generateTiles, getRoomCoordinates } from '../helpers';

const { rows, columns } = world;
const initialState = fromJS({
  rows,
  columns,
  tiles: generateTiles(rows * columns, columns)
    .map((tile, index) => index > 260 ? Object.assign(tile, { type: 'room' }) : tile)
});


console.log(getRoomCoordinates(initialState.get('tiles'), { x: 3, y: 3 }, 4, 5).toJS());



const reducer = (state = initialState, action) => {
  if (!action) return state;

  return state;
};

export default reducer;
