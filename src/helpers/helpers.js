/* eslint no-unused-vars: off */
import { List, Map, Set, fromJS } from 'immutable';
import random from 'lodash/random';

import { world } from '../config';

const {
  minRoomLength,
  maxRoomLength,
  minSplitProportion,
  maxSplitProportion
} = world;


export class Tile {
  constructor(position = { x: 0, y: 0 }, type = 'wall') {
    return { type, position };
  }
}


export const getPosition = (index = 0, columns = 1) => (
  { x: index % columns, y: Math.floor(index / columns) }
);

export const generateTiles = (amount = 0, columns = 1) => (
  fromJS(new Array(amount).fill().map(
    (_, index) => new Tile(getPosition(index, columns))
  ))
);

export const getTile = (tiles, { x, y }) => (
  tiles.find(tile => (
    tile.getIn(['position', 'x']) === x &&
    tile.getIn(['position', 'y']) === y
  ))
);

export const getRoomCoordinates = (tiles, { x, y }, { sizeX, sizeY }) => {
  const { x: columns, y: rows } = tiles.last().get('position').toJS();

  // Allign starting position when room has tiles beyond tiles borders
  if (x + sizeX > columns) x = columns - sizeX;
  if (y + sizeY > rows) y = rows - sizeY;

  return List().setSize(sizeY).flatMap(
    (_, rowIndex) => (
      List().setSize(sizeX - 1).reduce(
        (prev, _, index) => prev.push(Map({ x: index + x + 1, y: y + rowIndex })),
        List.of(Map({ x, y: y + rowIndex }))
      )
    )
  );
};

export const createOfType = (tiles, coordinates, type) => (
  // TODO: replace map with reduce and delete used room coordinates
  tiles.map(tile => {
    const { position: { x, y }} = tile.toJS();

    if (
      coordinates.some(room => (
        room.get('x') === x && room.get('y') === y
      ))
    ) return tile.set('type', type);

    return tile;
  })
);

export const getWallTiles = tiles => (
  tiles.filter(tile => tile.get('type') === 'wall')
);

export const getRandomTile = tiles => (
  tiles.get(random(0, tiles.size))
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

export const getSidesLength = tiles => ({
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
  tiles,
  depth = 1,
  minProportion = minSplitProportion,
  maxProportion = maxSplitProportion,
  splitDirection
) => {
  if (!depth) return tiles;

  const sidesProportion = getSidesProportion(getSidesLength(tiles));

  if (splitDirection === undefined) {
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

export const getNumbersBetweenTwoCuts = (cut1 = [], cut2 = []) => {
  if (cut1[1] < cut2[0]) {
    return List(Array(cut2[0] - cut1[1] - 1).fill().map(() => ++cut1[1]));
  }
  else if (cut2[1] < cut1[0]) {
    return List(Array(cut1[0] - cut2[1] - 1).fill().map(() => ++cut2[1]));
  }
  else return List();
};

export const getDirectCorridorCoord = (
  roomCoordinates1 = List(Map()),
  roomCoordinates2 = List(Map())
) => {
  const borders = [
    [
      roomCoordinates1.first(),
      roomCoordinates1.last()
    ],
    [
      roomCoordinates2.first(),
      roomCoordinates2.last()
    ]
  ];

  // TODO: refactor
  const [room1Xs, room2Xs] = [roomCoordinates1, roomCoordinates2].map(r => Set(r.map(c => c.get('x'))));
  const xIntersection = room1Xs.intersect(room2Xs).valueSeq();

  if (xIntersection.size) {
    const chosenX = xIntersection.get(random(0, xIntersection.size - 1));
    return (
      getNumbersBetweenTwoCuts(...borders.map(b => b.map(c => c.get('y'))))
        .map(y => Map({ x: chosenX, y }))
    );
  }
  else {
    const [room1Ys, room2Ys] = [roomCoordinates1, roomCoordinates2].map(r => Set(r.map(c => c.get('y'))));
    const yIntersection = room1Ys.intersect(room2Ys).valueSeq();

    if (yIntersection.size) {
      const chosenY = yIntersection.get(random(0, yIntersection.size - 1));
      return (
        getNumbersBetweenTwoCuts(...borders.map(b => b.map(c => c.get('x'))))
          .map(x => Map({ x, y: chosenY }))
      );
    }
    else return List();
  }
};
