import { expect } from 'chai';
import reducer from './reducer';

describe('reducer', () => {
  it('should have default state', () => {
    const state = reducer();

    expect(state).to.contain.all.keys('rows', 'columns', 'tiles');
    expect(state.tiles.toJS()).to.have.length.above(0);
  });

  it('should have tiles with position and type', () => {
    const state = reducer();

    expect(state.tiles.get(0).toJS()).to.contain.all.keys('position', 'type');
  });
});
