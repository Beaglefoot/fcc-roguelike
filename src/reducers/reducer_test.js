// import chai, { expect } from 'chai';
// import chaiImmutable from 'chai-immutable';
// import { Map, List } from 'immutable';
// import flatten from 'lodash/flatten';
//
// import reducer from './reducer';
// import { generateGrid } from '../actions';
//
// chai.use(chaiImmutable);
//
// describe('reducer', () => {
//   it('should return an empty Map() as a base case', () => {
//     expect(reducer()).to.equal(Map());
//     expect(reducer()).to.be.empty;
//   });
//
//   it('should react on generateGrid() action', () => {
//     const rows = 5;
//     const columns = 5;
//     const tiles = [
//       flatten,
//       List
//     ].reduce((result, fn) => fn(result),
//       Array(rows).fill().map((_, y) => (
//         Array(columns).fill().map((_, x) => Map({ type: 'wall', position: Map({ x, y }) }))
//       ))
//     );
//     const action = generateGrid(Map({ rows, columns, tiles }));
//     const reducerResult = reducer(Map(), action);
//     expect(reducerResult).to.include.keys('tiles', 'rows', 'columns');
//     expect(reducerResult.get('tiles')).to.have.size(rows * columns);
//     expect(reducerResult.get('tiles')).to.include(Map({ type: 'wall', position: Map({ x: 0, y: 2 }) }));
//   });
// });
