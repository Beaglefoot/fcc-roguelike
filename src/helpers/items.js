import { Map, List } from 'immutable';

import { getRandomPlacementPosition } from './player';

export const addItemToState = (state, item) => (
  state.update('items', items => items.concat(
    Map().set(getRandomPlacementPosition(state), List().push(item))
  ))
);

export const scatterConsumables = (state, levelSettings = Map(), consumables) => {
  const item = consumables.get(levelSettings.get('consumables'));

  return new Array(levelSettings.get('numberOfConsumables')).fill()
    .reduce(state => addItemToState(state, item), state);
};

export const placeItemIntoInventory = (state, itemsOnTile = Map(List())) => {
  if (!itemsOnTile.first()) return state;

  return state.updateIn(['player', 'inventory'],
    inventory => inventory.push(itemsOnTile.first().last())
  ).updateIn(['items', itemsOnTile.keySeq().first()], itemList => itemList.pop())
    .update('items', items => items.filter(itemsOnTile => itemsOnTile.size));
};

export const consumeHealthPotion = state => {
  const [index, potion] = state.getIn(['player', 'inventory'])
    .findEntry(item => item.get('name').includes('Health Potion')) || [];
  if (!potion) return state;
  const maxHP = state.getIn(['player', 'maxHP']);
  const effect = potion.get('effect');
  return state.updateIn(['player', 'hp'], (
    hp => hp + effect < maxHP ? hp + effect : maxHP)
  ).deleteIn(['player', 'inventory', index]);
};

export const getWeaponAsString = (weapon = Map()) => (
  weapon.reduce((str, val, key) => (
    key === 'damage' ? str.concat(` (${val.first()}-${val.last()})`) : str.concat(val)
  ), '') || 'Bare Hands (Base Attack)'
);

export const getArmorAsString = (armor = Map()) => (
  armor.reduce((str, val, key) => (
    key === 'protection' ? str.concat(` (${val})`): str.concat(val)
  ), '') || 'Linen Cloth (0)'
);
