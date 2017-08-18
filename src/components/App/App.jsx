import React from 'react';
import { connect } from 'react-redux';

import Grid from '../Grid/Grid';
import Bar from '../Bar/Bar';

import { app, health, experience, bars } from './App.scss';

const App = ({ hp, maxHP, xp, xpRange }) => (
  <div className={app}>
    <div className={bars}>
      { typeof hp !== 'undefined' && <Bar className={health} value={hp} max={maxHP} /> }
      {
        typeof xp !== 'undefined' &&
          <Bar className={experience} value={xp} max={xpRange.last()} min={xpRange.first()} />
      }
    </div>
    <Grid />
  </div>
);

const mapStateToProps = state => {
  const player = state.get('player');
  if (player) return {
    hp: player.get('hp'),
    maxHP: player.get('maxHP'),
    xp: player.get('xp'),
    xpRange: player.get('xpRange')
  };
  return {};
};

export default connect(mapStateToProps)(App);
