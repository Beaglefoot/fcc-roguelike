import { expect } from 'chai';

import { chooseAnother } from './common';

describe('chooseAnother()', () => {
  it('should return function', () => {
    expect(chooseAnother()).to.be.a('function');
  });

  it('should return function which returns not a provided value', () => {
    const notXY = chooseAnother(['x', 'y']);
    expect(notXY('x')).to.be.equal('y');
  });
});
