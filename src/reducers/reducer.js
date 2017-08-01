/* eslint no-unused-vars: off */
import { world } from '../config';

import {
  generateTiles,
  createRoom,
  getRandomTile,
  getRandomSizeForRoom,
  getRoomCoordinates,
  getSidesLength,
  splitTiles
} from '../helpers/helpers';

const {
  rows,
  columns,
  splitDepth,
  minRoomToSectionProportion,
  maxRoomToSectionProportion
} = world;
const tiles = generateTiles(rows * columns, columns);

const initialState = {
  rows,
  columns,
  tiles: splitTiles(tiles, splitDepth).flatten(splitDepth - 1)
    .map(part => {
      const { lengthX, lengthY } = getSidesLength(part);

      const minSizeX = Math.ceil(lengthX * minRoomToSectionProportion);
      const minSizeY = Math.ceil(lengthY * minRoomToSectionProportion);
      const maxSizeX = Math.floor(lengthX * maxRoomToSectionProportion);
      const maxSizeY = Math.floor(lengthY * maxRoomToSectionProportion);

      // console.log('roomSize restrictions: ', minSizeX, minSizeY, maxSizeX, maxSizeY);

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
