import React from 'react';
import { connect } from 'react-redux';

import { levelUp } from '../../actions';

class Player extends React.PureComponent {
  componentWillReceiveProps({ player, levelUp }) {
    const xp = player.get('xp');
    const xpCeil = player.get('xpRange').last();
    if (xp >= xpCeil) levelUp();
  }

  render() {
    return (
      <div>@</div>
    );
  }
}

export default connect(store => ({ player: store.get('player') }), { levelUp })(Player);
