import { expect } from 'chai';
import { fromJS } from 'immutable';

import {
  Tile,
  getPosition,
  generateTiles,
  getTile,
  getRoomCoordinates,
  createRoom,
  getInnerTiles
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


  const amount = 25;
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
      expect(getRoomCoordinates(tiles, { x: 1, y: 2 }, { sizeX: 2, sizeY: 2 }).toJS())
        .to.deep.equal([
          { x: 1, y: 2 },
          { x: 2, y: 2 },
          { x: 1, y: 3 },
          { x: 2, y: 3 }
        ]);
    });

    it('should modify starting position in case of overlapping borders', () => {
      console.log(tiles.toJS());
      console.log(getRoomCoordinates(tiles, { x: 4, y: 4 }, { sizeX: 2, sizeY: 2 }).toJS());
      expect(getRoomCoordinates(tiles, { x: 4, y: 4 }, { sizeX: 2, sizeY: 2 }).toJS())
        .to.deep.equal([
          { x: 2, y: 2 },
          { x: 3, y: 2 },
          { x: 2, y: 3 },
          { x: 3, y: 3 }
        ]);
    });
  });

  describe('createRoom()', () => {
    it('should return tiles with provided room coordinates', () => {
      expect(
        createRoom(tiles, fromJS([{ x: 1, y: 1 }, { x: 2, y: 1 }])).toJS()
      ).to.contain({ position: { x: 1, y: 1,}, type: 'room' })
        .and.to.contain({ position: { x: 2, y: 1,}, type: 'room' });
    });
  });

  describe('getInnerTiles()', () => {
    it('should return tiles which are not near the edges', () => {
      expect(getInnerTiles(tiles, amount / columns, columns).toJS())
        .to.include({ position: { x: 1, y: 1 }, type: 'wall' })
        .and
        .not.to.include({ position: { x: columns - 1, y: 1 }, type: 'wall' })
        .and
        .not.to.include({ position: { x: 1, y: amount / columns - 1 }, type: 'wall' })
        .and
        .not.to.include({ position: { x: 0, y: 0 }, type: 'wall' });
    });
  });
});
