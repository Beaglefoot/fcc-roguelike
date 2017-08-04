/* eslint no-unused-vars: off */
import { world } from '../config';
import { Map, List, fromJS } from 'immutable';

import {
  generateTiles,
  createOfType,
  getRandomTile,
  getRandomSizeForRoom,
  getRoomCoordinates,
  getSidesLength,
  splitTiles,
  getDirectCorridorCoord,
  connectSectionsWithCorridors
} from '../helpers/helpers';

const {
  rows,
  columns,
  splitDepth,
  minRoomToSectionProportion,
  maxRoomToSectionProportion
} = world;

// Each section contains a room
const sections = splitTiles(generateTiles(rows * columns, columns), splitDepth)
  // Leave innermost sections only
  .flatten(splitDepth - 1)
  .map(part => {
    const { lengthX, lengthY } = getSidesLength(part);

    // minRoomToSectionProportion should be greater than 0.5
    // for direct connection of adjacent rooms
    const [
      [minSizeX, maxSizeX],
      [minSizeY, maxSizeY]
    ] = [lengthX, lengthY].map(
      len => [
        Math.ceil(len * minRoomToSectionProportion),
        Math.floor(len * maxRoomToSectionProportion)
      ]
    );

    return createOfType(
      part,
      getRoomCoordinates(
        part,
        getRandomTile(part).get('position').toObject(),
        getRandomSizeForRoom(minSizeX, minSizeY, maxSizeX, maxSizeY)
      ),
      'room'
    );
  });

const tiles = connectSectionsWithCorridors(sections);


const initialState = {
  rows,
  columns,
  tiles
};



const reducer = (state = initialState, action) => {
  if (!action) return state;

  return state;
};

export default reducer;
