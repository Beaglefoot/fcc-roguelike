class Tile {
  constructor(id, position = { x: 0, y: 0 }, type = 'wall') {
    return { id, type, position };
  }
}

export const getPosition = (id = 0, columns = 1) => (
  { x: id % columns, y: Math.floor(id / columns) }
);

export const generateTiles = (amount = 0, columns = 1) => (
  new Array(amount).fill().map(
    (_, index) => new Tile(index, getPosition(index, columns))
  )
);

export const getTileType = (tiles, index) => tiles.get(index).get('type');

export const getTileId = (posX = 0, posY = 0, rowLength = 0) => (
  posX + posY * rowLength
);
