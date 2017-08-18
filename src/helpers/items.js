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
