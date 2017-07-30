import { world } from '../config';
// import { fromJS } from 'immutable';

import {
  generateTiles,
  createRoom,
  getInnerTiles,
  getRandomTile,
  getRandomSizeForRoom,
  getRoomCoordinates
} from '../helpers/helpers';

const { rows, columns } = world;
const tiles = generateTiles(rows * columns, columns);

const initialState = {
  rows,
  columns,
  tiles: createRoom(
    tiles,
    getRoomCoordinates(
      tiles,
      getRandomTile(getInnerTiles(tiles, rows, columns))
        .get('position')
        .toJS(),
      getRandomSizeForRoom()
    )
    // fromJS([
    //   { x: 3, y: 3 },
    //   { x: 4, y: 3 },
    //   { x: 3, y: 4 },
    //   { x: 4, y: 4 },
    // ])
  )
};




const reducer = (state = initialState, action) => {
  if (!action) return state;

  return state;
};

export default reducer;
