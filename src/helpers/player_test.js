import chai, { expect } from 'chai';
import chaiImmutable from 'chai-immutable';
import { Map, fromJS } from 'immutable';
import times from 'lodash/times';
import uniq from 'lodash/uniq';

import { convertTilesToMap } from './grid';
import { getRandomPlacementPosition } from './player';

chai.use(chaiImmutable);

describe('player helper functions', () => {
  const tiles = convertTilesToMap(fromJS([
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
  ]));

  it('should return random position within allowed tiles', () => {
    const result = getRandomPlacementPosition(tiles);
    expect([Map({ x: 24, y: 40 }), Map({ x: 56, y: 8 })]).to.deep.include(result);
  });

  it('should not return position of a player', () => {
    const result = uniq(
      times(50, () => getRandomPlacementPosition(tiles, Map({ x: 56, y: 8 })))
    )[0];
    expect(result).equal(Map({ x: 24, y: 40 }))
      .and.not.to.equal(Map({ x: 56, y: 8 }));
  });
});
