import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import capitalize from 'lodash/capitalize';

import { bossInRange } from '../../helpers/player';

import { logger, title } from './Logger.scss';

class Logger extends React.PureComponent {
  constructor() {
    super();
    this.state = { history: [] };
  }

  componentWillReceiveProps({ lastAction: action, creatures, player }) {
    const currentCreatures = this.props.creatures;
    const currentPlayer = this.props.player;

    const msg = ({
      MOVE_PLAYER: () => {
        const boss = bossInRange(player);
        if (boss && !bossInRange(currentPlayer) && boss.get('hp') > 0) return boss.get('encounterText');
      },
      ATTACK_CREATURE: () => {
        const race = action.getIn(['payload', 'race']);
        const creaturePosition = action.getIn(['payload', 'position']);
        const hpPath = [creaturePosition, 'hp'];
        const creatureHP = currentCreatures.getIn(hpPath);
        const creatureMaxHP = currentCreatures.getIn([creaturePosition, 'maxHP']);
        const creatureDamage = creatureHP - creatures.getIn(hpPath);
        const playerDamage = currentPlayer.get('hp') - player.get('hp');

        const result = [
          `You attack ${race} and deal [${creatureDamage}] damage. ${capitalize(race)} `.concat(
            (playerDamage === 0 && creatureHP > 0)
              ? 'is unable to retaliate.'
              : `retaliates with [${playerDamage}] damage.`
          )
        ];

        if (race === 'Mimic' && creatureHP === creatureMaxHP) result.unshift(
          'Once you get closer to the chest, you find out that it\'s actually a living creature with a row of sharp white teeth. Mimic!'
        );

        return result;
      },
      USE_HEAL_POTION: () => `You are healed by [${player.get('hp') - currentPlayer.get('hp')}] points.`,
      PICK_ITEM: () => `You pick ${action.get('payload').first().last().get('name')}.`,
      EQUIP_ITEM: () => `You equip ${action.getIn(['payload', 'name'])}.`,
      LEVEL_UP: () => 'Your level increases. You feel stronger and revitalized.',
      KILL_CREATURE: () => {
        const race = action.getIn(['payload', 'race']);
        const items = List()
          .push(
            ...action.getIn(['payload', 'inventory']).values(),
            ...action.getIn(['payload', 'equipped']).values()
          )
          .filter(item => item.size > 0)
          .map(item => item.get('name'))
          .join(', ')
          .replace(/(.*), /, (_, p1) => p1.concat(' and '));

        return `${capitalize(race)} dies.${items.length ? ' It drops '.concat(items, '.') : ''}`;
      },
      PLAYER_DIES: () => [
        'You feel unbearable weakness and the world around you fades...',
        'Game Over'
      ],
      GENERATE_WORLD: () => {
        const result = [
          ''.concat(
            'After drowning in debt for decades, you decide that it\'s time to change everything. ',
            'So you buy the \'Journal Of Most Prosperous Dugeons\' and find for yourself kinda lazy, but profitable adventure. ',
            'There is a catchy advertisement about a large chest full of gold somewhere deep in this dungeon. ',
            'But will you succeed in finding it?'
          )
        ];

        if (bossInRange(player)) result.push(bossInRange(player).get('encounterText'));
        return result;
      },
      TELEPORT_TO_NEXT_LEVEL: () => {
        const result = [
          ''.concat(
            'Once you step into the portal your surroundings change their shape. ',
            'Your vision is blurred and then suddenly, it\'s sharp again. Everything looks different...'
          )
        ];

        if (bossInRange(player)) result.push(bossInRange(player).get('encounterText'));
        return result;
      },
      WIN_GAME: () => ''.concat(
        'After defeating the evil mimic you find out something unusual. ',
        'Instead of another corpse you have a chest full of gold, your ultimate goal. ',
        'It turns out that ad is true after all... ',
        'Congratulations on beating the dungeon! ',
        'Would you like to start over?'
      )
    }[action.get('type')] || (() => ''))();

    if (msg) this.setState({ history: this.state.history.concat(msg) });
  }

  componentDidUpdate() {
    const element = document.getElementsByClassName(logger)[0];
    element.scrollTop = element.scrollHeight;
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className={title}>Story Log:</div>
        <div className={logger}>
          {
            this.state.history.map((record, index) => (
              <div key={index}>{record}</div>
            ))
          }
        </div>
      </div>
    );
  }
}

Logger.propTypes = {
  lastAction: ImmutablePropTypes.map,
  creatures: ImmutablePropTypes.map,
  player: ImmutablePropTypes.map,
  className: PropTypes.string
};

export default Logger;
