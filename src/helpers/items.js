import { Map } from 'immutable';

import { getRandomPlacementPosition } from './player';

export const addItemToState = (state, item) => (
  state.update('items', items => items.concat(Map().set(getRandomPlacementPosition(state), item )))
);

export const scatterConsumables = (state, levelSettings = Map(), consumables) => {
  const item = consumables.get(levelSettings.get('consumables'));

  return new Array(levelSettings.get('numberOfConsumables')).fill()
    .reduce(state => addItemToState(state, item), state);
};

export const placeItemIntoInventory = (state, item = Map()) => (
  state.updateIn(['player', 'inventory'],
    inventory => inventory.push(item.first())
  ).deleteIn(['items', item.keySeq().first()])
);

export const consumeHealthPotion = state => {
  const [index, potion] = state.getIn(['player', 'inventory'])
    .findEntry(item => item.get('name').includes('Health Potion'));
  const maxHP = state.getIn(['player', 'maxHP']);
  const effect = potion.get('effect');
  return state.updateIn(['player', 'hp'], (
    hp => hp + effect < maxHP ? hp + effect : maxHP)
  ).deleteIn(['player', 'inventory', index]);
};
