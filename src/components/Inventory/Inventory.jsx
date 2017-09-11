import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { equipItem, useHealPotion } from '../../actions';

import { getItemAsString, getItemType } from '../../helpers/items';
import { inventory, list, item as itemClass, title } from './Inventory.scss';



const Inventory = ({
  inventory: inventoryList,
  equipItem,
  useHealPotion,
  playerIsAlive,
  className
}) => (
  <div className={classNames(inventory, className)}>
    <div className={title}>Inventory:</div>
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

Inventory.propTypes = {
  inventory: ImmutablePropTypes.list,
  equipItem: PropTypes.func,
  useHealPotion: PropTypes.func,
  playerIsAlive: PropTypes.bool,
  className: PropTypes.string
};

export default connect(null, { equipItem, useHealPotion })(Inventory);
