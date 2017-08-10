import { expect } from 'chai';
import { Map } from 'immutable';

import { chooseAnother, getRandomMapValue } from './common';

describe('chooseAnother()', () => {
  it('should return function', () => {
    expect(chooseAnother()).to.be.a('function');
  });

  it('should return function which returns not a provided value', () => {
    const notXY = chooseAnother(['x', 'y']);
    expect(notXY('x')).to.be.equal('y');
  });
});

describe('getRandomMapValue()', () => {
  it('should return random values from map', () => {
    const map = Map({ a: 0, b: 1 });

    let counter = 50000;
    const results = [0, 0];

    while (counter--) results[getRandomMapValue(map)]++;

    expect(Math.abs(1 - results[0] / results[1])).to.be.below(0.05);
  });
});
