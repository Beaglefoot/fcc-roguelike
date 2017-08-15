import { world } from '../../config/general';

import {
  generateTiles,
  createOfType,
  getRandomTile,
  getRandomSizeForRoom,
  getRoomCoordinates,
  getSidesLength,
  splitTiles,
  connectSectionsWithCorridors
} from '../../helpers/grid';

const {
  rows,
  columns,
  splitDepth,
  minRoomToSectionProportion,
  maxRoomToSectionProportion,
  currentGameLevel
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

const initialState = {
  rows,
  columns,
  // tiles have to be converted to usual object to
  // save immutable functionality. More on this:
  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Transferring_data_to_and_from_workers_further_details
  tiles: connectSectionsWithCorridors(sections).toJS(),
  currentGameLevel
};



postMessage(initialState);
