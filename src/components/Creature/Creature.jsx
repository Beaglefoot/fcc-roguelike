import React from 'react';
import { connect } from 'react-redux';

import { killCreature } from '../../actions';

class Creature extends React.Component {
  componentWillReceiveProps({ creature, killCreature }) {
    if (creature.get('hp') <= 0) killCreature(creature);
  }

  render() {
    const hp = this.props.creature.get('hp');
    const race = this.props.creature.get('race');

    return (
      <div>
        {hp > 0 ? race[0] : '%'}
      </div>
    );
  }
}

export default connect(null, { killCreature })(Creature);
