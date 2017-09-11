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

import {
  app,
  health,
  experience,
  bars,
  title,
  grid,
  stats,
  inventory as invStyle,
  logger,
  restart,
  help,
  info,
  buttons
} from './App.scss';

const App = props => {
  const player = props.player ? props.player.toObject() : {};
  const { hp, maxHP, xp, xpRange, inventory, level } = player;
  const { currentGameLevel } = props;

  return (
    <div className={app}>
      { currentGameLevel && <h1 className={title}>Lazy Dungeon Crawler</h1> }
      <div className={bars}>
        { typeof hp !== 'undefined' && <Bar className={health} value={hp} max={maxHP} /> }
        { typeof xp !== 'undefined' && <Bar className={experience} value={xp} max={xpRange.last()} /> }
      </div>
      <Grid className={grid} />
      {
        typeof level !== 'undefined' &&
          <div className={info}>
            <Stats {...player} floor={currentGameLevel} className={stats} />
            <Inventory inventory={inventory} playerIsAlive={hp > 0} className={invStyle} />
          </div>
      }
      { typeof level !== 'undefined' && <Logger {...props} className={logger} /> }
      {
        currentGameLevel &&
          <div className={buttons}>
            <Restart className={restart} />
            <Help className={help} />
          </div>
      }
    </div>
  );
};

const mapStateToProps = state => (
  pick(state.toObject(), ['player', 'creatures', 'lastAction', 'currentGameLevel'])
);

export default connect(mapStateToProps)(App);
