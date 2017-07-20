export const getTileType = (tiles = [], index = 0) => tiles[index].type;

export const getTileId = (posX = 0, posY = 0, rowLength = 0) => (
  posX + posY * rowLength
);
