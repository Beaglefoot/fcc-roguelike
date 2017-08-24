import React from 'react';
import { connect } from 'react-redux';

import { levelUp } from '../../actions';

import { flyingText } from './Player.scss';

class Player extends React.PureComponent {
  animateLevelUp() {
    const p = document.getElementById('player-symbol').getBoundingClientRect();
    const levelUpElement = document.createElement('div');

    levelUpElement.appendChild(document.createTextNode('Level Up'));
    levelUpElement.classList.add(flyingText);
    levelUpElement.style.left = `${p.left}px`;
    levelUpElement.style.top = `${p.top}px`;

    document.body.appendChild(levelUpElement);

    setTimeout(() => document.body.removeChild(levelUpElement), 5000);
  }

  componentWillReceiveProps({ player, levelUp }) {
    const xp = player.get('xp');
    const xpCeil = player.get('xpRange').last();
    if (xp >= xpCeil) {
      levelUp();
      this.animateLevelUp();
    }
  }

  render() {
    return <div id="player-symbol">@</div>;
  }
}

export default connect(store => ({ player: store.get('player') }), { levelUp })(Player);
