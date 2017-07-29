import { List, fromJS } from 'immutable';

export class Tile {
  constructor(position = { x: 0, y: 0 }, type = 'wall') {
    return { type, position };
  }
}

export const getPosition = (index = 0, columns = 1) => (
  { x: index % columns, y: Math.floor(index / columns) }
);

export const generateTiles = (amount = 0, columns = 1) => (
  fromJS(new Array(amount).fill().map(
    (_, index) => new Tile(getPosition(index, columns))
  ))
);

export const getTile = (tiles, { x, y }) => (
  tiles.find(tile => (
    tile.getIn(['position', 'x']) === x &&
    tile.getIn(['position', 'y']) === y
  ))
);

export const getRoomCoordinates = (tiles, { x, y }, sizeX, sizeY) => (
  List().setSize(sizeY).map(
    (_, rowIndex) => (
      List().setSize(sizeX - 1).reduce(
        (prev, _, index) => prev.concat({ x: index + x + 1, y: y + rowIndex }),
        List.of({ x, y: y + rowIndex })
      )
    )
  ).flatten(true)
);

//
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

