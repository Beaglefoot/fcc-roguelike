import React from 'react';
import { connect } from 'react-redux';
import pick from 'lodash/pick';

import Grid from '../Grid/Grid';
import Bar from '../Bar/Bar';
import Stats from '../Stats/Stats';
import Inventory from '../Inventory/Inventory';
import Logger from '../Logger/Logger';
import Restart from '../Restart/Restart';
import Help from '../Help/Help';

import { app, health, experience, bars, info } from './App.scss';

const App = props => {
  const player = props.player ? props.player.toObject() : {};
  const { hp, maxHP, xp, xpRange, inventory, level } = player;
  const { currentGameLevel } = props;

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
        typeof level !== 'undefined' &&
          <div className={info}>
            <Stats {...player} floor={currentGameLevel} />
            <Logger {...props} />
            <Inventory inventory={inventory} />
          </div>
      }
      { currentGameLevel && <Restart /> }
      { currentGameLevel && <Help /> }
    </div>
  );
};

const mapStateToProps = state => (
  pick(state.toObject(), ['player', 'creatures', 'lastAction', 'currentGameLevel'])
);

export default connect(mapStateToProps)(App);
