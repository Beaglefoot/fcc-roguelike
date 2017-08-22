import React from 'react';

import { getWeaponAsString, getItemAsString } from '../../helpers/items';

import { stats } from './Stats.scss';

const Stats = ({ level, attack, protection, equipped, floor }) => (
  <ul className={stats}>
    <li>{`Floor: ${floor}`}</li>
    <li>{`Level: ${level}`}</li>
    <li>{`Attack: ${attack.first()}-${attack.last()}`}</li>
    <li>{`Protection: ${protection}`}</li>
    <li>{`Weapon: ${getWeaponAsString(equipped.get('weapon'))}`}</li>
    <li>{`Armor: ${getItemAsString(equipped.get('armor'), 'Linen Cloth (0)')}`}</li>
  </ul>
);

export default Stats;
