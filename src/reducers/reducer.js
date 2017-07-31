/* eslint no-unused-vars: off */
import { world } from '../config';
// import { fromJS } from 'immutable';

import {
  generateTiles,
  createRoom,
  getInnerTiles,
  getRandomTile,
  getRandomSizeForRoom,
  getRoomCoordinates,
  splitTiles
} from '../helpers/helpers';

const { rows, columns } = world;
const tiles = generateTiles(rows * columns, columns);

let innerTiles = getInnerTiles(tiles);
const coord = getRoomCoordinates(
  tiles,
  getRandomTile(innerTiles)
    .get('position')
    .toJS(),
  getRandomSizeForRoom()
);

// console.log(
//   splitTiles(tiles, 2).flatten(1).toJS().length
// );

const initialState = {
  rows,
  columns,
  tiles: splitTiles(tiles, 2).flatten(1)
    .map(part => createRoom(
      part,
      getRoomCoordinates(
        part,
        getRandomTile(getInnerTiles(part)).get('position').toJS(),
        getRandomSizeForRoom()
      )
    ))
    .flatten(1)

  // tiles: createRoom(
  //   tiles,
  //   coord
    // fromJS([
    //   { x: 3, y: 3 },
    //   { x: 4, y: 3 },
    //   { x: 3, y: 4 },
    //   { x: 4, y: 4 },
    // ])
  // )
};

console.log(initialState.tiles.toJS());




const reducer = (state = initialState, action) => {
  if (!action) return state;

  return state;
};

export default reducer;
