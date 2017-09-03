import React from 'react';
import { connect } from 'react-redux';

import { clearState, generateWorld } from '../../actions';

import { restart } from './Restart.scss';

const Restart = props => (
  <div
    className={restart}
    onClick={() => {
      props.clearState();
      props.generateWorld();
    }}
  >
    Restart
  </div>
);

export default connect(null, { clearState, generateWorld })(Restart);
