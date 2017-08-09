/* eslint no-unused-vars: off */
import { Map } from 'immutable';

import { GENERATE_GRID } from '../actions';



const reducer = (state = Map(), action) => {
  if (!action) return state;

  switch(action.type) {
  case GENERATE_GRID:
    return state.merge(action.grid);
  default:
    return state;
  }
};

export default reducer;
