import { Map } from 'immutable';

import { getRandomPlacementPosition } from './player';

export class Creature {
  constructor(position = Map()) {
    return Map().set(position, Map({ position }));
  }
}

export const addCreatureToState = state => (
  state.updateIn(['creatures'], creatures => creatures.concat(new Creature(
    getRandomPlacementPosition(state.get('tiles'), state.getIn(['player', 'position']))
  )))
);
