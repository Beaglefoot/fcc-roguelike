/* eslint no-unused-vars: off */
import { Map, List } from 'immutable';
import random from 'lodash/random';

import { getRandomPlacementPosition } from './player';

import { weapons, armor as armorList, consumables } from '../config/equipment';

export class Creature {
  constructor(position = Map(), creature = Map()) {
    const equipment = creature.get('equipment');
    const weapon = Creature.getEquipment(equipment, 'weapon', weapons);
    const armor = Creature.getEquipment(equipment, 'armor', armorList);
    const inventory = Creature.getEquipment(equipment, 'inventory', consumables);

    return Map().set(
      position,
      creature
        .delete('equipment')
        .set('position', position)
        .set('inventory', inventory)
        .set('equipped', Map({ weapon, armor }))
    );
  }

  static getEquipment(equipment, type = '', list = {}) {
    return random(0, 1) >= equipment.getIn([type, 'chance']) ?
      Map(list[equipment.getIn([type, 'name'])]) :
      Map();
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

export const creatureDies = state => (
  state.updateIn(['player', 'xp'], xp => xp + 1)
);
