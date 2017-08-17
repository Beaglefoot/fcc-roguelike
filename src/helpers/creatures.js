import { Map, List } from 'immutable';
import random from 'lodash/random';

import { getRandomPlacementPosition } from './player';

export class Creature {
  constructor(position = Map(), creature = Map()) {
    return Map().set(position, creature.set('position', position));
  }
}

export const addCreatureToState = (state = Map(), creature = Map()) => (
  state.update('creatures',
    creatures => creatures.concat(
      new Creature( getRandomPlacementPosition(state), creature )
    ))
);

export const pickRandomCreature = (creatures = List()) => (
  creatures.get(random(0, creatures.size - 1))
);

export const populateWorld = (state, levelSettings = Map(), creatures = Map()) => {
  const currentLevel = state.get('currentGameLevel');
  const creatureList = creatures.get(String(currentLevel));

  return new Array(levelSettings.get('numberOfCreatures')).fill()
    .reduce(state => addCreatureToState(state, pickRandomCreature(creatureList)), state);
};
