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

      const [
        [minSizeX, maxSizeX],
        [minSizeY, maxSizeY]
      ] = [lengthX, lengthY].map(
        len => [
          Math.ceil(len * minRoomToSectionProportion),
          Math.floor(len * maxRoomToSectionProportion)
        ]
      );

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



const reducer = (state = initialState, action) => {
  if (!action) return state;

  return state;
};

export default reducer;
