/* eslint no-unused-vars: off */
import { List, Map, fromJS } from 'immutable';
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

export const getRoomCoordinates = (tiles, { x, y }, { sizeX, sizeY }) => {
  console.log(`x: ${x}, y: ${y}, sizeX: ${sizeX}, sizeY: ${sizeY}`);
  const { x: columns, y: rows } = tiles.last().get('position').toJS();

  // Allign starting position when room has tiles beyond tiles borders
  if (x + sizeX > columns) x = columns - sizeX;
  if (y + sizeY > rows) y = rows - sizeY;

  return List().setSize(sizeY).flatMap(
    (_, rowIndex) => (
      List().setSize(sizeX - 1).reduce(
        (prev, _, index) => prev.push(Map({ x: index + x + 1, y: y + rowIndex })),
        List.of(Map({ x, y: y + rowIndex }))
      )
    )
  );
};

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

export const getInnerTiles = tiles => {
  const { x: columns, y: rows } = tiles.last().get('position').toJS();

  return tiles.filter(tile => {
    const x = tile.getIn(['position', 'x']);
    const y = tile.getIn(['position', 'y']);

    return x !== 0
      && x !== columns
      && y !== 0
      && y !== rows;
  });
};

export const getRandomTile = tiles => (
  tiles.get(random(0, tiles.size))
);

export const getRandomSizeForRoom =
  (minSizeX = 3, maxSizeX = 10, minSizeY = 3, maxSizeY = 10) => (
    {
      sizeX: random(minSizeX, maxSizeX),
      sizeY: random(minSizeY, maxSizeY)
    }
  );
