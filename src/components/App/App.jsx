import React from 'react';
import { connect } from 'react-redux';

import Grid from '../Grid/Grid';
import Bar from '../Bar/Bar';

import { app, health } from './App.scss';

const App = ({ hp, maxHP }) => (
  <div className={app}>
    { hp && <Bar className={health} value={hp} max={maxHP} /> }
    <Grid />
  </div>
);

const mapStateToProps = state => {
  const player = state.get('player');
  if (player) return { hp: player.get('hp'), maxHP: player.get('maxHP') };
  return {};
};

export default connect(mapStateToProps)(App);
