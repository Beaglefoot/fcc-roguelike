import React from 'react';
import { connect } from 'react-redux';

import { movePlayer } from '../../actions';
import { findKeyByCode } from '../../helpers/player';

class Player extends React.PureComponent {
  constructor() {
    super();
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    const key = findKeyByCode(event.keyCode);
    if (key) this.props.movePlayer(key);
  }

  componentDidMount() {
    addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    removeEventListener('keydown', this.handleKeyPress);
  }

  render() {
    return <div>@</div>;
  }
}

export default connect(null, { movePlayer })(Player);
