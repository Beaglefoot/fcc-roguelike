import { expect } from 'chai';
import reducer from '../../src/reducers';

describe('reducer', () => {
  it('should have default state', () => {
    const state = reducer();

    expect(state).to.contain.all.keys('rows', 'columns', 'tiles');
    expect(state.tiles).to.have.length.above(0);
  });

  it('should have tiles with id and type', () => {
    const state = reducer();

    expect(state.tiles[0]).to.contain.all.keys('id', 'type');
  });
});
