import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { clearState, generateWorld } from '../../actions';

import { restart } from './Restart.scss';

const Restart = ({ clearState, generateWorld, className }) => (
  <div
    className={classNames(restart, className)}
    onClick={() => {
      clearState();
      generateWorld();
    }}
  >
    Restart
  </div>
);

Restart.propTypes = {
  clearState: PropTypes.func,
  generateWorld: PropTypes.func,
  className: PropTypes.string
};

export default connect(null, { clearState, generateWorld })(Restart);
