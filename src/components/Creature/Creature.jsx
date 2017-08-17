import React from 'react';

const Creature = ({ hp, race }) => (
  <div>
    {hp > 0 ? race[0] : '%'}
  </div>
);

export default Creature;
