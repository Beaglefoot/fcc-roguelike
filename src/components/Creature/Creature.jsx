import React from 'react';
import { connect } from 'react-redux';

import { killCreature } from '../../actions';

class Creature extends React.Component {
  componentWillReceiveProps({ creature, killCreature }) {
    if (creature.get('hp') <= 0) killCreature(creature);
  }

  markDamageWithColor(hp, maxHP) {
    if (hp <= 0) return 'rgb(0, 0, 0)';
    return `rgb(${Math.floor((maxHP - hp) * 255 / maxHP)}, 0, 0)`;
  }

  render() {
    const hp = this.props.creature.get('hp');
    const maxHP = this.props.creature.get('maxHP');
    const race = this.props.creature.get('race');

    return (
      <div style={{ color: this.markDamageWithColor(hp, maxHP) }}>
        {hp > 0 ? race[0] : '%'}
      </div>
    );
  }
}

export default connect(null, { killCreature })(Creature);
