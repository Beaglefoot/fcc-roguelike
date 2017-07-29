import { expect } from 'chai';

import {
  Tile,
  getPosition,
  generateTiles,
  getTile,
  getRoomCoordinates
} from './helpers';

describe('helper functions', () => {
  describe('getPosition()', () => {
    it('should return { x: 0, y: 0 } for index 0', () => {
      expect(getPosition(0)).to.deep.equal({ x: 0, y: 0 });
    });

    it('should return { x: 4, y: 0 } for index 4 and columns = 5', () => {
      expect(getPosition(4, 5)).to.deep.equal({ x: 4, y: 0 });
    });

    it('should return { x: 2, y: 1 } for index 7 and columns = 5', () => {
      expect(getPosition(7, 5)).to.deep.equal({ x: 2, y: 1 });
    });
  });


  describe('generateTiles()', () => {
    it('should generate correct number of tiles', () => {
      expect(generateTiles(11).toJS()).to.have.length.of(11);
    });

    it('should generate correct tiles', () => {
      expect(generateTiles(4, 2).toJS()).to.include(new Tile({ x: 1, y: 1 }, 'wall'));
    });
  });


  const amount = 20;
  const columns = 5;
  const tiles = generateTiles(amount, columns);


  describe('getTile()', () => {
    it('should return correct tile', () => {
      expect(getTile(tiles, { x: 2, y: 1 }).toJS())
        .to.deep.equal({ type: 'wall', position: { x: 2, y: 1 }});
    });
  });


  describe('getRoomCoordinates()', () => {
    it('should return correct room coordinates', () => {
      expect(getRoomCoordinates(tiles, { x: 1, y: 2 }, 2, 2).toJS())
        .to.deep.equal([
          { x: 1, y: 2 },
          { x: 2, y: 2 },
          { x: 1, y: 3 },
          { x: 2, y: 3 }
        ]);
    });
  });
});
