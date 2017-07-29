class Tile {
  constructor(position = { x: 0, y: 0 }, type = 'wall') {
    return { type, position };
  }
}

export const getPosition = (index = 0, columns = 1) => (
  { x: index % columns, y: Math.floor(index / columns) }
);

export const generateTiles = (amount = 0, columns = 1) => (
  new Array(amount).fill().map(
    (_, index) => new Tile(getPosition(index, columns))
  )
);

export const getTileType = (tiles, { x, y }) => (
  tiles.find(tile => (
    tile.getIn(['position', 'x']) === x &&
    tile.getIn(['position', 'y']) === y
  )).get('type')
);
