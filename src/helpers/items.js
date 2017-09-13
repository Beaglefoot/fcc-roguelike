import { Map, List } from 'immutable';

import { getRandomPlacementPosition, recalcBattleStats } from './player';

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

export const placeItemsIntoInventory = (state, itemsOnTile = Map(List())) => (
  state.updateIn(['player', 'inventory'],
    inventory => inventory.concat(itemsOnTile.first())
  ).deleteIn(['items', itemsOnTile.keySeq().first()])
);

export const consumeHealthPotion = (state, potion) => {
  if (!potion) {
    const keyPotionPair = state.getIn(['player', 'inventory'])
      .findEntry(item => item.get('name').includes('Health Potion'));

    if (!keyPotionPair) return state;
    potion = keyPotionPair.reduce((key, potion) => potion.set('key', key));
  }

  const index = potion.get('key');
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

export const getItemAsString = (item = Map(), defaultText = '') => (
  item.has('damage')
    ? getWeaponAsString(item)
    : item.reduce((str, val, key) => (
      key !== 'name' ? str.concat(` (${val})`): str.concat(val)
    ), '') || defaultText
);

export const getItemType = (item = Map()) => {
  if (item.has('damage')) return 'weapon';
  if (item.has('protection')) return 'armor';
  if (item.get('name').includes('Potion')) return 'potion';
  return null;
};

export const equipItem = (state, item = Map()) => {
  const itemType = getItemType(item);
  const currentlyEquipped = state.getIn(['player', 'equipped', itemType]);

  return state
    .updateIn(
      ['player', 'inventory'],
      inventory => currentlyEquipped.has('name') ? inventory.push(currentlyEquipped) : inventory
    )
    .setIn(['player', 'equipped', itemType], item.delete('key'))
    .deleteIn(['player', 'inventory', item.get('key')])
    .update('player', player => recalcBattleStats(player));
};
