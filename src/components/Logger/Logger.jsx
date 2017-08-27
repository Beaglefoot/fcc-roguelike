import React from 'react';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';

import { logger } from './Logger.scss';

class Logger extends React.PureComponent {
  constructor() {
    super();

    this.state = { history: [] };
  }

  componentWillReceiveProps({ action, creatures, player }) {
    console.log(action.get('type'));

    const currentCreatures = this.props.creatures;
    const currentPlayer = this.props.player;

    const msg = {
      ATTACK_CREATURE: (() => {
        const race = action.getIn(['payload', 'race']);
        const creaturePosition = action.getIn(['payload', 'position']);
        const hpPath = [creaturePosition, 'hp'];
        const creatureDamage = currentCreatures.getIn(hpPath) - creatures.getIn(hpPath);
        const playerDamage = currentPlayer.get('hp') - player.get('hp');

        return `You attack ${race} and deals ${creatureDamage} damage.
        ${capitalize(race)} retaliates with ${playerDamage} damage.`;
      })()
    }[action.get('type')];

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

const mapStateToProps = state => (
  {
    action: state.get('lastAction'),
    player: state.get('player'),
    creatures: state.get('creatures')
  }
);

export default connect(mapStateToProps)(Logger);
