import React from 'react';
import { connect } from 'react-redux';

import { clearState, generateGrid } from '../../actions';

import { restart } from './Restart.scss';

const Restart = props => (
  <div
    className={restart}
    onClick={() => {
      props.clearState();
      props.generateGrid();
    }}
  >
    Restart
  </div>
);

export default connect(null, { clearState, generateGrid })(Restart);
