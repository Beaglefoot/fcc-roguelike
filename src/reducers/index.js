import { world } from '../config';
import { fromJS } from 'immutable';
// import flatten from 'lodash/flatten';

import { generateTiles } from '../helpers';

const { rows, columns } = world;
const initialState = fromJS({
  rows,
  columns,
  tiles: generateTiles(rows * columns, columns)
    .map((tile, index) => index > 260 ? Object.assign(tile, { type: 'room' }) : tile)
});

// const getRoomCoordinates = (tiles, startingTileId = 0, sizeX, sizeY) => {
//   const startingPosition = tiles
//     .find(tile => tile.get('id') === startingTileId)
//     .get('position');
//
//   return flatten(List().setSize(sizeY).map(
//     (_, rowIndex) => (
//       List().setSize(sizeX - 1).reduce(
//         (prev, _, index) => prev.concat({ x: index + startingTileId + 1, y: rowIndex }),
//         List.of({ ...startingPosition, y: rowIndex })
//       )
//     )
//   ));
// };
//
// console.log(getRoomCoordinates(initialState.get('tiles'), 3, 4, 5));

// const createRoom = (tiles, roomCoordinates) => (
//   tiles.map(tile => {
//     const { position: { x, y }} = tile;
//     const roomTileIndex = roomCoordinates.findIndex({ rx, ry } => rx === x && ry === y);
//
//     if (roomTileIndex !== -1) {
//       delete roomCoordinates[roomTileIndex];
//       return { ...tile, { type: 'room' }};
//     }
//   })
// );

const reducer = (state = initialState, action) => {
  if (!action) return state;

  return state;
};

export default reducer;
