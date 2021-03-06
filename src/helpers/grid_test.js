import chai, { expect } from 'chai';
import { Map, fromJS } from 'immutable';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);

import {
  Tile,
  getPosition,
  generateTiles,
  getRoomCoordinates,
  createOfType,
  splitTiles,
  getSidesLength,
  getDirectCorridorCoord,
  getDistance,
  getSurroundingTileCoordinates
} from './grid';

describe('grid helper functions', () => {
  describe('getPosition()', () => {
    it('should return { x: 0, y: 0 } for index 0', () => {
      expect(getPosition(0).toJS()).to.deep.equal({ x: 0, y: 0 });
    });

    it('should return { x: 4, y: 0 } for index 4 and columns = 5', () => {
      expect(getPosition(4, 5).toJS()).to.deep.equal({ x: 4, y: 0 });
    });

    it('should return { x: 2, y: 1 } for index 7 and columns = 5', () => {
      expect(getPosition(7, 5).toJS()).to.deep.equal({ x: 2, y: 1 });
    });
  });


  describe('generateTiles()', () => {
    it('should generate correct number of tiles', () => {
      expect(generateTiles(11).toJS()).to.have.length.of(11);
    });

    it('should generate correct tiles', () => {
      expect(generateTiles(4, 2).toJS()).to.include((new Tile({ x: 1, y: 1 }, 'wall')).toJS());
    });
  });


  const amount = 25;
  const columns = 5;
  const tiles = generateTiles(amount, columns);



  describe('getRoomCoordinates()', () => {
    it('should return correct room coordinates', () => {
      expect(getRoomCoordinates(tiles, { x: 1, y: 2 }, { sizeX: 2, sizeY: 2 }).toJS())
        .to.deep.equal([
          { x: 1, y: 2 },
          { x: 2, y: 2 },
          { x: 1, y: 3 },
          { x: 2, y: 3 }
        ]);
    });

    it('should modify starting position in case of overlapping borders', () => {
      expect(getRoomCoordinates(tiles, { x: 4, y: 4 }, { sizeX: 2, sizeY: 2 }).toJS())
        .to.deep.equal([
          { x: 2, y: 2 },
          { x: 3, y: 2 },
          { x: 2, y: 3 },
          { x: 3, y: 3 }
        ]);
    });
  });

  describe('createOfType()', () => {
    it('should return tiles with provided room coordinates', () => {
      expect(
        createOfType(tiles, fromJS([{ x: 1, y: 1 }, { x: 2, y: 1 }]), 'room').toJS()
      ).to.contain({ position: { x: 1, y: 1,}, type: 'room' })
        .and.to.contain({ position: { x: 2, y: 1,}, type: 'room' });
    });
  });

  describe('splitTiles()', () => {
    it('should split titles into 2 parts horizontally', () => {
      const split = splitTiles(tiles, 1, 0.5, 0.5, 'y').toJS();

      expect(split)
        .to.be.an('array')
        .and.have.a.lengthOf(2);

      expect(split[0].map(tile => tile.position))
        .to.include.deep.members([
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 3, y: 1 },
          { x: 4, y: 1 }
        ]);

      expect(split[1].map(tile => tile.position))
        .to.include.deep.members([
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 3, y: 4 },
          { x: 4, y: 4 }
        ]);
    });
  });

  describe('getSidesLength()', () => {
    it('should return object with length of sides for a rectangle of tiles', () => {
      expect(getSidesLength(tiles)).to.deep.equal({ lengthX: 5, lengthY: 5 });
    });
  });


  describe('getDirectCorridorCoord()', () => {
    it('should return corridor coordinates for two rooms', () => {
      const room1 = fromJS([
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 }
      ]);

      const room2 = fromJS([
        { x: 5, y: 2 },
        { x: 6, y: 2 },
        { x: 5, y: 3 },
        { x: 6, y: 3 }
      ]);

      expect(getDirectCorridorCoord(room1, room2).toJS()).to.deep.equal([
        { x: 3, y: 2 },
        { x: 4, y: 2 }
      ]);

      const room3 = fromJS([
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 }
      ]);

      const room4 = fromJS([
        { x: 2, y: 5 },
        { x: 3, y: 5 },
        { x: 2, y: 6 },
        { x: 3, y: 6 }
      ]);

      expect(getDirectCorridorCoord(room3, room4).toJS()).to.deep.equal([
        { x: 2, y: 3 },
        { x: 2, y: 4 }
      ]);
    });

    it('should return corridor coordinates for room connected with a corridor', () => {
      const section1 = fromJS([
        // room
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        // corridor
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        // room
        { x: 5, y: 2 },
        { x: 6, y: 2 },
        { x: 5, y: 3 },
        { x: 6, y: 3 }
      ]);

      const section2 = fromJS([
        { x: 3, y: 4 },
        { x: 4, y: 4 },
        { x: 3, y: 5 },
        { x: 4, y: 5 }
      ]);

      const corridorCoord = getDirectCorridorCoord(section1, section2).toJS();

      expect([
        { x: 3, y: 3 },
        { x: 4, y: 3 }
      ]).to.deep.include.members(corridorCoord);
    });
  });

  describe('getDistance()', () => {
    it('should return a number of tiles to traverse to get from one position to another', () => {
      expect(
        getDistance(Map({ x: 1, y: 10 }), Map({ x: 1, y: 1 }))
      ).to.equal(9);

      expect(
        getDistance(Map({ x: 1, y: 10 }), Map({ x: 1, y: 12 }))
      ).to.equal(2);

      expect(
        getDistance(Map({ x: 0, y: 0 }), Map({ x: 0, y: 0 }))
      ).to.equal(0);

      expect(
        getDistance(Map({ x: 2, y: 1 }), Map({ x: 3, y: 4 }))
      ).to.equal(4);
    });
  });

  describe('getSurroundingTileCoordinates()', () => {
    it('should return tiles around a given position', () => {
      const rows = 10;
      const columns = 10;
      const radius = 2;
      const position = Map({ x: 2, y: 2 });
      const result = getSurroundingTileCoordinates(position, radius, rows, columns);

      expect(result.toJS()).to.deep.include.members([
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        { y: 0, x: 2 },
        { y: 1, x: 2 },
        { y: 3, x: 2 },
        { y: 4, x: 2 },
        { x: 1, y: 1 },
        { x: 3, y: 3 },
        { x: 1, y: 3 },
        { x: 3, y: 1 }
      ]);
    });

    it('should ignore tiles beyond given rows and columns', () => {
      const rows = 10;
      const columns = 10;
      const radius = 2;
      const position = Map({ x: 1, y: 1 });
      const result = getSurroundingTileCoordinates(position, radius, rows, columns);

      expect(result.toJS()).to.deep.include.members([
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { y: 0, x: 1 },
        { y: 2, x: 1 },
        { y: 3, x: 1 },
        { x: 0, y: 1 },
        { x: 2, y: 2 },
        { x: 0, y: 2 },
        { x: 2, y: 1 }
      ]).and.not.to.include({ x: -1, y: 1 });
    });
  });
});
