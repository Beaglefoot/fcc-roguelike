/* eslint no-unused-vars: off */
import { Map, List, fromJS } from 'immutable';
import random from 'lodash/random';

import { getRandomPlacementPosition } from './player';

import { weapons, armor as armorList, consumables } from '../config/equipment';

export class Creature {
  constructor(position = Map(), creature = Map()) {
    const equipment = creature.get('equipment');
    const weapon = Creature.getEquipment(equipment, 'weapon', weapons);
    const armor = Creature.getEquipment(equipment, 'armor', armorList);
    const inventory = List().push(Creature.getEquipment(equipment, 'inventory', consumables));

    return Map().set(
      position,
      creature
        .delete('equipment')
        .set('hp', creature.get('maxHP'))
        .set('position', position)
        .set('inventory', inventory)
        .set('equipped', Map({ weapon, armor }))
        .update('attack', attack => (
          attack.mergeWith((base, wep) => base + wep, weapon.get('damage'))
        ))
        .update('protection', protection => (
          protection + (armor.get('protection') || 0)
        ))
    );
  }

  static getEquipment(equipment, type = '', list = {}) {
    return random(0, 1, true) <= equipment.getIn([type, 'chance']) ?
      fromJS(list[equipment.getIn([type, 'name'])]) :
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
  const creatureList = creatures.getIn([String(currentLevel), 'common']);
  const bossesList = creatures.getIn([String(currentLevel), 'bosses']) || List();

  const stateWithCreatures = new Array(levelSettings.get('numberOfCreatures')).fill()
    .reduce(state => addCreatureToState(state, pickRandomCreature(creatureList)), state);

  return bossesList.reduce((state, boss) => addCreatureToState(state, boss), stateWithCreatures);
};

export const dropItems = (state, creature) => {
  const position = creature.get('position');
  const weapon = creature.getIn(['equipped', 'weapon']);
  const armor = creature.getIn(['equipped', 'armor']);
  const inventory = creature.get('inventory');
  const itemsOnTile = state.getIn(['items', position]) || List();

  const drop = [weapon, armor, ...inventory.values()].reduce(
    (drop, item) => item.size ? drop.push(item) : drop,
    itemsOnTile
  );

  return (drop => drop.size ? state.setIn(['items', position], drop) : state)(drop);
};

export const creatureDies = (state, creature) => (
  dropItems(state, creature)
    .updateIn(['player', 'xp'], xp => xp + 1)
    .setIn(['creatures', creature.get('position'), 'isDead'], true)
);
