import chai, { expect } from 'chai';
import { List, fromJS } from 'immutable';
import chaiImmutable from 'chai-immutable';
import uniq from 'lodash/uniq';

import { pickRandomCreature } from './creatures';

chai.use(chaiImmutable);

describe('creatures helpers', () => {
  describe('pickRandomCreature()', () => {
    it('should return random creature from provided List', () => {
      const creatures = fromJS([
        { 'race': 'kobold' , 'hp': 30 , 'attack': 8  , 'lvl': '1'},
        { 'race': 'goblin' , 'hp': 25 , 'attack': 7  , 'lvl': '1'}
      ]);

      const count = 50;
      const result = uniq(new Array(count).fill().map(() => pickRandomCreature(creatures)));

      expect(result).to.have.lengthOf(2);
      expect(List(result)).to.include(...creatures.values());
    });
  });
});
