/* eslint no-unused-vars: off */
import { world } from '../config';

import {
  generateTiles,
  createRoom,
  getRandomTile,
  getRandomSizeForRoom,
  getRoomCoordinates,
  splitTiles
} from '../helpers/helpers';

const { rows, columns, splitDepth } = world;
const tiles = generateTiles(rows * columns, columns);

const initialState = {
  rows,
  columns,
  tiles: splitTiles(tiles, splitDepth).flatten(splitDepth - 1)
    .map(part => {
      const lengthX = (
        part.last().getIn(['position', 'x']) -
        part.first().getIn(['position', 'x'])
      );
      const lengthY = (
        part.last().getIn(['position', 'y']) -
        part.first().getIn(['position', 'y'])
      );

      const minSizeX = Math.ceil(lengthX / 2);
      const minSizeY = Math.ceil(lengthY / 2);
      const maxSizeX = Math.floor(lengthX * 0.9);
      const maxSizeY = Math.floor(lengthY * 0.9);

      console.log('roomSize restrictions: ', minSizeX, minSizeY, maxSizeX, maxSizeY);

      return createRoom(
        part,
        getRoomCoordinates(
          part,
          getRandomTile(part).get('position').toJS(),
          getRandomSizeForRoom(minSizeX, minSizeY, maxSizeX, maxSizeY)
        )
      );
    })
    .flatten(1)
};

// console.log(initialState.tiles.toJS());




const reducer = (state = initialState, action) => {
  if (!action) return state;

  return state;
};

export default reducer;
