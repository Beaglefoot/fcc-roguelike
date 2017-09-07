import React from 'react';
import { connect } from 'react-redux';

import { levelUp, playerDies } from '../../actions';

import { flyingText, flicker } from './Player.scss';

class Player extends React.PureComponent {
  animateLevelUp() {
    const p = document.getElementById('player-symbol').getBoundingClientRect();
    const levelUpElement = document.createElement('div');

    levelUpElement.appendChild(document.createTextNode('Level Up'));
    levelUpElement.classList.add(flyingText);
    levelUpElement.style.left = `${p.left}px`;
    levelUpElement.style.top = `${p.top}px`;

    document.body.appendChild(levelUpElement);

    setTimeout(() => document.body.removeChild(levelUpElement), 3000);
  }

  componentDidUpdate() {
    const { player, levelUp, playerDies } = this.props;
    const xp = player.get('xp');
    const xpCeil = player.get('xpRange').last();
    const hp = player.get('hp');

    if (xp >= xpCeil) {
      levelUp();
      this.animateLevelUp();
    }

    if (hp <= 0) playerDies();
  }

  render() {
    return (
      <div
        id="player-symbol"
        className={this.props.justMounted && flicker}
      >
        @
      </div>
    );
  }
}

export default connect(store => ({ player: store.get('player') }), { levelUp, playerDies })(Player);
