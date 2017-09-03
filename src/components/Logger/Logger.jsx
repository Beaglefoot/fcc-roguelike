import React from 'react';
import { List } from 'immutable';
import capitalize from 'lodash/capitalize';

import { logger } from './Logger.scss';

class Logger extends React.PureComponent {
  constructor() {
    super();
    this.state = { history: [] };
  }

  componentWillReceiveProps({ lastAction: action, creatures, player }) {
    console.log(action.get('type'));

    const currentCreatures = this.props.creatures;
    const currentPlayer = this.props.player;

    const msg = ({
      ATTACK_CREATURE: () => {
        const race = action.getIn(['payload', 'race']);
        const creaturePosition = action.getIn(['payload', 'position']);
        const hpPath = [creaturePosition, 'hp'];
        const currentCreatureHP = currentCreatures.getIn(hpPath);
        const creatureDamage = currentCreatureHP - creatures.getIn(hpPath);
        const playerDamage = currentPlayer.get('hp') - player.get('hp');

        return `You attack ${race} and deal [${creatureDamage}] damage. ${capitalize(race)} `.concat(
          (playerDamage === 0 && currentCreatureHP > 0)
            ? 'is unable to retaliate.'
            : `retaliates with [${playerDamage}] damage.`
        );
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
      GENERATE_WORLD: () => '\
      You heard some rumors about a large chest full of gold somewhere deep in this dungeon.\
      Will you succeed in finding it?\
      ',
      TELEPORT_TO_NEXT_LEVEL: () => '\
      Once you step into the portal your surroundings change their shape.\
      Your vision is blurred and then suddenly, it\'s sharp again. Everything looks different...\
      ',
      WIN_GAME: () => '\
      After defeating the evil mimic you find out something unusual.\
      Instead of another corpse you have a chest full of gold, your ultimate goal.\
      Congratulations on beating the dungeon!\
      Would you like to start over?\
      '
    }[action.get('type')] || (() => ''))();

    if (msg) this.setState({ history: this.state.history.concat(msg) });
  }

  componentDidUpdate() {
    const element = document.getElementsByClassName(logger)[0];
    element.scrollTop = element.scrollHeight;
  }

  render() {
    return (
      <div>
        <div>Story Log:</div>
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

export default Logger;
