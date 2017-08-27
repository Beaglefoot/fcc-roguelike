import React from 'react';
// import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';

import { logger } from './Logger.scss';

class Logger extends React.PureComponent {
  constructor() {
    super();
    this.state = { history: [] };
  }

  componentWillReceiveProps({ lastAction: action, creatures, player }) {
    console.log(action.get('type'));

    const currentCreatures = this.props.creatures;
    const currentPlayer = this.props.player;

    const msg = ({
      ATTACK_CREATURE: () => {
        const race = action.getIn(['payload', 'race']);
        const creaturePosition = action.getIn(['payload', 'position']);
        const hpPath = [creaturePosition, 'hp'];
        const currentCreatureHP = currentCreatures.getIn(hpPath);
        const creatureDamage = currentCreatureHP - creatures.getIn(hpPath);
        const playerDamage = currentPlayer.get('hp') - player.get('hp');

        return `You attack ${race} and deal [${creatureDamage}] damage. ${capitalize(race)} `.concat(
          (playerDamage === 0 && currentCreatureHP > 0)
            ? 'is unable to retaliate.'
            : `retaliates with [${playerDamage}] damage.`
        );
      },
      USE_HEAL_POTION: () => `You are healed by [${player.get('hp') - currentPlayer.get('hp')}] points.`,
      PICK_ITEM: () => `You pick ${action.get('payload').first().last().get('name')}.`,
      EQUIP_ITEM: () => `You equip ${action.getIn(['payload', 'name'])}.`
    }[action.get('type')] || (() => ''))();

    this.setState({ history: this.state.history.concat(msg) });
  }

  componentDidUpdate() {
    const element = document.getElementsByClassName(logger)[0];
    element.scrollTop = element.scrollHeight;
  }

  render() {
    return (
      <div>
        <div>Story Log:</div>
        <div className={logger}>
          {
            this.state.history.map((record, index) => (
              <div key={index}>{record}</div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default Logger;
