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
  getDirectCorridorCoord
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
  tiles: splitTiles(tiles, splitDepth)
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
    })
    // At this point there is an array of sections of tiles.
    // Each section contains a room. The idea is to build corridors
    .reduce((mem, section) => {
      const result = mem.get('result');
      const prev = mem.get('prev');

      if (!prev.size) return Map({ result, prev: section });
      // Sections are combined into bigger ones
      else {
        const [
          roomCoordinates1,
          roomCoordinates2
        ] = [prev, section].map(s => (
          s.filter(tile => tile.get('type') === 'room')
            .map(tile => tile.get('position'))
        ));
        const combinedSectionWithCorridor = createOfType(
          prev.concat(section),
          getDirectCorridorCoord(roomCoordinates1, roomCoordinates2),
          'corridor'
        );

        return Map({ result: result.push(combinedSectionWithCorridor), prev: List() });
      }

    }, Map({ result: List(), prev: List() }))
    .get('result')
    .flatten(1)
};



const reducer = (state = initialState, action) => {
  if (!action) return state;

  return state;
};

export default reducer;
