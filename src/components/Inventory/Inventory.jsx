import React from 'react';
import { connect } from 'react-redux';

import { equipItem, useHealPotion } from '../../actions';

import { getItemAsString, getItemType } from '../../helpers/items';
import { inventory, list, item as itemClass } from './Inventory.scss';



const Inventory = ({ inventory: inventoryList, equipItem, useHealPotion, playerIsAlive }) => (
  <div className={inventory}>
    <div>Inventory:</div>
    <ul className={list}>
      {
        inventoryList.map((item, key) => (
          <li
            key={key}
            className={itemClass}
            onClick={() => (
              playerIsAlive && getItemType(item) === 'potion'
                ? useHealPotion(item.set('key', key))
                : equipItem(item.set('key', key))
            )}
          >
            {`${getItemAsString(item)}`}
          </li>
        ))
      }
    </ul>
  </div>
);

export default connect(null, { equipItem, useHealPotion })(Inventory);
