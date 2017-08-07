/* eslint no-unused-vars: off */
import { GENERATE_GRID } from '../actions';



const reducer = (state = {}, action) => {
  if (!action) return state;

  switch(action.type) {
  case GENERATE_GRID:
    return { ...action.grid };
  default:
    return state;
  }

};

export default reducer;
