import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { killCreature } from '../../actions';

class Creature extends React.PureComponent {
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

Creature.propTypes = {
  creature: ImmutablePropTypes.map,
  killCreature: PropTypes.func
};

export default connect(null, { killCreature })(Creature);
