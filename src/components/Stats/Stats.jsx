import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classNames from 'classnames';

import { getWeaponAsString, getItemAsString } from '../../helpers/items';

import { stats } from './Stats.scss';

const Stats = ({ level, attack, protection, equipped, floor, className }) => (
  <ul className={classNames(stats, className)}>
    <li><span>{'Floor: '}</span>{floor}</li>
    <li><span>{'Level: '}</span>{level}</li>
    <li><span>{'Attack: '}</span>{`${attack.first()}-${attack.last()}`}</li>
    <li><span>{'Protection: '}</span>{protection}</li>
    <li><span>{'Weapon: '}</span>{getWeaponAsString(equipped.get('weapon'))}</li>
    <li><span>{'Armor: '}</span>{getItemAsString(equipped.get('armor'), 'Linen Cloth (0)')}</li>
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
