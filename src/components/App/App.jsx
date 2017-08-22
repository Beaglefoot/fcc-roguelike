import React from 'react';
import { connect } from 'react-redux';

import Grid from '../Grid/Grid';
import Bar from '../Bar/Bar';
import Stats from '../Stats/Stats';
import Inventory from '../Inventory/Inventory';

import { app, health, experience, bars, info } from './App.scss';

const App = props => {
  const { hp, maxHP, xp, xpRange, inventory } = props;

  return (
    <div className={app}>
      <div className={bars}>
        { typeof hp !== 'undefined' && <Bar className={health} value={hp} max={maxHP} /> }
        {
          typeof xp !== 'undefined' &&
            <Bar className={experience} value={xp} max={xpRange.last()} min={xpRange.first()} />
        }
      </div>
      <Grid />
      {
        typeof props.level !== 'undefined' &&
          <div className={info}>
            <Inventory inventory={inventory} />
            <Stats {...props} />
          </div>
      }
    </div>
  );
};

const mapStateToProps = state => {
  const player = state.get('player');
  const floor = state.get('currentGameLevel');
  if (player) return { ...player.toObject(), floor };
  return {};
};

export default connect(mapStateToProps)(App);
