import React from 'react';

import { getItemAsString } from '../../helpers/items';
import { inventory, list } from './Inventory.scss';

const Inventory = ({ inventory: inventoryList }) => (
  <div className={inventory}>
    <div>Inventory:</div>
    <ul className={list}>
      { inventoryList.map((item, key) => <li key={key}>{`${getItemAsString(item)}`}</li>) }
    </ul>
  </div>
);

export default Inventory;
