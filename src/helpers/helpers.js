import { List, fromJS } from 'immutable';
import random from 'lodash/random';

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

export const createRoom = (tiles, roomCoordinates) => (
  // TODO: replace map with reduce and delete used room coordinates
  tiles.map(tile => {
    const { position: { x, y }} = tile.toJS();

    if (
      roomCoordinates.some(room => (
        room.get('x') === x && room.get('y') === y
      ))
    ) return tile.set('type', 'room');

    return tile;
  })
);

export const getWallTiles = tiles => (
  tiles.filter(tile => tile.get('type') === 'wall')
);

export const getInnerTiles = (tiles, rows, columns) => (
  tiles.filter(tile => {
    const x = tile.getIn(['position', 'x']);
    const y = tile.getIn(['position', 'y']);

    return x !== 0
      && x !== columns - 1
      && y !== 0
      && y !== rows - 1;
  })
);

export const getRandomTile = tiles => (
  tiles.get(random(0, tiles.size))
);
