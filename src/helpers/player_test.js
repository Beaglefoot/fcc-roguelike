import chai, { expect } from 'chai';
import chaiImmutable from 'chai-immutable';
import { Map, fromJS } from 'immutable';
import times from 'lodash/times';
import uniq from 'lodash/uniq';

import { getRandomPlacementPosition } from './player';
import { convertTilesToMap } from './grid';

chai.use(chaiImmutable);

describe('player helper functions', () => {
  let state = fromJS({
    tiles: [
      {
        type: 'wall',
        position: {
          x: 36,
          y: 28
        }
      },
      {
        type: 'wall',
        position: {
          x: 28,
          y: 36
        }
      },
      {
        type: 'room',
        position: {
          x: 24,
          y: 40
        }
      },
      {
        type: 'room',
        position: {
          x: 56,
          y: 8
        }
      }
    ]
  });
  state = state.set('tiles', convertTilesToMap(state.get('tiles')));

  describe('getRandomPlacementPosition()', () => {
    it('should return random position within allowed tiles', () => {
      const result = getRandomPlacementPosition(state);
      expect([Map({ x: 24, y: 40 }), Map({ x: 56, y: 8 })]).to.deep.include(result);
    });

    it('should not return position of a player', () => {
      const result = uniq(
        times(50, () => getRandomPlacementPosition(state.setIn(['player', 'position'], Map({ x: 56, y: 8 }))))
      )[0];

      expect(result).equal(Map({ x: 24, y: 40 }))
        .and.not.to.equal(Map({ x: 56, y: 8 }));
    });

    it('should not return position of a creature', () => {
      const result = uniq(
        times(50, () => getRandomPlacementPosition(state.setIn(['creatures', Map({ x: 56, y: 8 })], 'meow')))
      )[0];
      console.log(result);

      expect(result).equal(Map({ x: 24, y: 40 }))
        .and.not.to.equal(Map({ x: 56, y: 8 }));
    });
  });
});
