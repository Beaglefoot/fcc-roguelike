/* eslint no-unused-vars: off */
import { List, Map, Set, Range, fromJS } from 'immutable';
import random from 'lodash/random';
import curry from 'lodash/curry';

import { world } from '../config';
import { chooseAnother } from './common';

const {
  minRoomLength,
  maxRoomLength,
  minSplitProportion,
  maxSplitProportion
} = world;

const notXY = chooseAnother(['x', 'y']);


export class Tile {
  constructor(position = Map({ x: 0, y: 0 }), type = 'wall') {
    return Map({ type, position });
  }
}


export const getPosition = (index = 0, columns = 1) => (
  Map({ x: index % columns, y: Math.floor(index / columns) })
);

export const generateTiles = (amount = 0, columns = 1) => (
  List(new Array(amount).fill().map(
    (_, index) => new Tile(getPosition(index, columns))
  ))
);

export const getTile = (tiles = List(Map()), { x, y }) => (
  tiles.find(tile => (
    tile.getIn(['position', 'x']) === x &&
    tile.getIn(['position', 'y']) === y
  ))
);

export const getRoomCoordinates = (tiles = List(Map()), { x, y }, { sizeX, sizeY }) => {
  const { x: columns, y: rows } = tiles.last().get('position').toJS();

  // Allign starting position when room has tiles beyond tiles borders
  if (x === 0) {
    x = 1;
    sizeX--;
  }
  if (y === 0) {
    y = 1;
    sizeY--;
  }
  if (x + sizeX >= columns) x = columns - sizeX;
  if (y + sizeY >= rows) y = rows - sizeY;

  return List().setSize(sizeY).flatMap(
    (_, rowIndex) => (
      List().setSize(sizeX - 1).reduce(
        (prev, _, index) => prev.push(Map({ x: index + x + 1, y: y + rowIndex })),
        List.of(Map({ x, y: y + rowIndex }))
      )
    )
  );
};

export const createOfType = (tiles = List(Map()), coordinates = List(Map()), type = 'room') => (
  tiles.reduce((mem, tile) => {
    const { position: { x, y }} = tile.toJS();
    const indexInCoordinates = mem.get('coordinates').findIndex(room => (
      room.get('x') === x && room.get('y') === y
    ));

    if (indexInCoordinates !== -1) {
      return mem.update('tiles', tiles => tiles.push(tile.set('type', type)))
        .update('coordinates', coord => coord.delete(indexInCoordinates));
    }

    return mem.update('tiles', tiles => tiles.push(tile));
  }, Map({ tiles: List(), coordinates })).get('tiles')
);

export const getWallTiles = (tiles = List(Map())) => (
  tiles.filter(tile => tile.get('type') === 'wall')
);

export const getRandomTile = (tiles = List(Map())) => (
  tiles.get(random(0, tiles.size - 1))
);

export const getRandomSizeForRoom = (
  minSizeX = minRoomLength,
  minSizeY = minRoomLength,
  maxSizeX = maxRoomLength,
  maxSizeY = maxRoomLength
) => (
  {
    sizeX: random(minSizeX, maxSizeX),
    sizeY: random(minSizeY, maxSizeY)
  }
);

export const getSidesLength = (tiles = List(Map())) => ({
  lengthX: (
    tiles.last().getIn(['position', 'x']) -
    tiles.first().getIn(['position', 'x']) + 1
  ),
  lengthY: (
    tiles.last().getIn(['position', 'y']) -
    tiles.first().getIn(['position', 'y']) + 1
  )
});

export const getSidesProportion = ({ lengthX, lengthY }) => lengthX / lengthY;

export const splitTiles = (
  tiles = List(Map()),
  depth = 1,
  minProportion = minSplitProportion,
  maxProportion = maxSplitProportion,
  splitDirection = ''
) => {
  if (!depth) return tiles;

  const sidesProportion = getSidesProportion(getSidesLength(tiles));

  if (!splitDirection) {
    if (sidesProportion < 0.75) splitDirection = 'y';
    else if (sidesProportion > 1.5) splitDirection = 'x';
    else splitDirection = random() ? 'x' : 'y';
  }

  const proportion = random(minProportion, maxProportion);
  const startLineNum = tiles.first().getIn(['position', splitDirection]);
  const endLineNum = tiles.last().getIn(['position', splitDirection]);

  const splitLineNum = startLineNum + Math.floor((endLineNum - startLineNum) * proportion);

  return tiles.reduce((split, tile) => (
    tile.getIn(['position', splitDirection]) < splitLineNum
      ? split.set(0, split.get(0).push(tile))
      : split.set(1, split.get(1).push(tile))
  ), fromJS([[],[]]))
    .map(part => splitTiles(part, depth - 1));
};

export const getDirectCorridorBorders = (
  roomCoordinates1 = List(Map()),
  roomCoordinates2 = List(Map()),
  corridorDirection = 'x',
  chosenAxisNum = 0
) => (
  List([
    roomCoordinates1,
    roomCoordinates2
  ]).map(room => (
    room.filter(c => c.get(corridorDirection) === chosenAxisNum)
      .map(c => c.get(notXY(corridorDirection)))
      .filter((y, _, list) => y === list.min() || y === list.max())
      .sort()
  )).reduce((finalMinMax, minMaxPair, _, minMaxList) => {
    if (minMaxPair.size === 1) return finalMinMax.push(minMaxPair.first());
    else {
      return finalMinMax.push(
        minMaxPair.find(num => (
          num !== minMaxList.flatten().min() && num !== minMaxList.flatten().max()
        ))
      );
    }
  }, List([]))
);

export const getCommonValuesInAxis = curry((
  roomCoordinates1 = List(Map()),
  roomCoordinates2 = List(Map()),
  axis
) => (
  [roomCoordinates1, roomCoordinates2].map(r => Set(r.map(c => c.get(axis))))
    .reduce((intersection, coordinates) => intersection.intersect(coordinates).valueSeq())
), 3);

// roomCoordinates can include corridors as well
export const getDirectCorridorCoord = (
  roomCoordinates1 = List(Map()),
  roomCoordinates2 = List(Map())
) => {
  const getIntersection = getCommonValuesInAxis(roomCoordinates1, roomCoordinates2);
  const { intersection, axis } = [
    { intersection: getIntersection('x'), axis: 'x' },
    { intersection: getIntersection('y'), axis: 'y' }
  ].find(obj => obj.intersection.size) || {};

  if (typeof intersection === 'undefined') return List();

  const chosenNum = intersection.get(random(0, intersection.size - 1));
  const corridorBorders = getDirectCorridorBorders(roomCoordinates1, roomCoordinates2, axis, chosenNum);
  const createCoord = num => Map({ [axis]: chosenNum, [notXY(axis)]: num });

  return (
    List(Range(corridorBorders.first() + 1, corridorBorders.last())).map(createCoord)
  );
};

export const connectSectionsWithCorridors = (sections = List(List(Map()))) => {
  if (sections.size === 1) return sections.flatten(1);

  return connectSectionsWithCorridors(
    sections.reduce((mem, section) => {
      const result = mem.get('result');
      const prev = mem.get('prev');

      if (!prev.size) return Map({ result, prev: section });
      // Sections are combined into bigger ones
      else {
        const [
          roomCoordinates1,
          roomCoordinates2
        ] = [prev, section].map(s => (
          s.filter(tile => (
            ['room', 'corridor'].some(type => type === tile.get('type')
            ))).map(tile => tile.get('position'))
        ));
        const combinedSectionWithCorridor = createOfType(
          prev.concat(section),
          getDirectCorridorCoord(roomCoordinates1, roomCoordinates2),
          'corridor'
        );

        return Map({ result: result.push(combinedSectionWithCorridor), prev: List() });
      }

    }, Map({ result: List(), prev: List() })).get('result')
  );
};
