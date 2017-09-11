import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classNames from 'classnames';

import { getWeaponAsString, getItemAsString } from '../../helpers/items';

import { stats } from './Stats.scss';

const Stats = ({ level, attack, protection, equipped, floor, className }) => (
  <ul className={classNames(stats, className)}>
    <li>{`Floor: ${floor}`}</li>
    <li>{`Level: ${level}`}</li>
    <li>{`Attack: ${attack.first()}-${attack.last()}`}</li>
    <li>{`Protection: ${protection}`}</li>
    <li>{`Weapon: ${getWeaponAsString(equipped.get('weapon'))}`}</li>
    <li>{`Armor: ${getItemAsString(equipped.get('armor'), 'Linen Cloth (0)')}`}</li>
  </ul>
);

Stats.propTypes = {
  level: PropTypes.number,
  attack: ImmutablePropTypes.list,
  protection: PropTypes.number,
  equipped: ImmutablePropTypes.map,
  floor: PropTypes.number,
  className: PropTypes.string
};

export default Stats;
