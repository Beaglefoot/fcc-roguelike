import { Map, List, fromJS } from 'immutable';

import { convertTilesToMap } from '../helpers/grid';

import GridWorker from '../workers/grid_worker';

export const GENERATE_GRID = 'GENERATE_GRID';
export const INIT_PLAYER = 'INIT_PLAYER';
export const MOVE_PLAYER = 'MOVE_PLAYER';
export const INIT_CREATURES = 'INIT_CREATURES';
export const INIT_ITEMS = 'INIT_ITEMS';
export const PICK_ITEM = 'PICK_ITEM';
export const USE_HEAL_POTION = 'USE_HEAL_POTION';
export const KILL_CREATURE = 'KILL_CREATURE';
export const LEVEL_UP = 'LEVEL_UP';
export const EQUIP_ITEM = 'EQUIP_ITEM';
export const ATTACK_CREATURE = 'ATTACK_CREATURE';
export const CLEAR_STATE = 'CLEAR_STATE';
export const PLAYER_DIES = 'PLAYER_DIES';
export const INIT_PORTAL = 'INIT_PORTAL';

// grid looses its type after returning from web worker
export const generateGrid = (gameLevel = 1) => dispatch => (
  new Promise((resolve, reject) => {
    const worker = new GridWorker();

    worker.postMessage(gameLevel);
    worker.onmessage = ({ data }) => {
      data = fromJS(data);
      const tiles = convertTilesToMap(data.get('tiles'));

      dispatch({
        type: GENERATE_GRID,
        payload: data.set('tiles', tiles)
      });

      resolve();
    };
    worker.onerror = ({ message }) => reject(message);
  })
);

export const initPlayer = () => ({ type: INIT_PLAYER });
export const movePlayer = (position = Map()) => ({ type: MOVE_PLAYER, payload: position });
export const initCreatures = () => ({ type: INIT_CREATURES });
export const initItems = () => ({ type: INIT_ITEMS });
export const pickItem = (items = Map(List())) => ({ type: PICK_ITEM, payload: items });
export const useHealPotion = (potion = Map()) => ({ type: USE_HEAL_POTION, payload: potion.size && potion });
export const levelUp = () => ({ type: LEVEL_UP });
export const equipItem = (item = Map()) => ({ type: EQUIP_ITEM, payload: item });
export const attackCreature = (creature = Map()) => ({ type: ATTACK_CREATURE, payload: creature });
export const clearState = () => ({ type: CLEAR_STATE });
export const playerDies = () => ({ type: PLAYER_DIES });
export const initPortal = () => ({ type: INIT_PORTAL });
export const generateWorld = gameLevel => dispatch => (
  dispatch(generateGrid(gameLevel))
    .then(() => (
      [
        initPortal,
        initCreatures,
        initItems,
        initPlayer
      ].forEach(action => dispatch(action()))
    ))
    .then(() => (!gameLevel || gameLevel === 1) && dispatch({ type: 'GENERATE_WORLD' }))
    .catch(console.log)
);
export const teleportToNextLevel = () => (dispatch, getState) => {
  const nextGameLevel = getState().get('currentGameLevel') + 1;

  dispatch(clearState());
  dispatch(generateWorld(nextGameLevel)).then(
    () => dispatch({ type: 'TELEPORT_TO_NEXT_LEVEL' })
  );
};
export const killCreature = (creature = Map()) => (dispatch, getState) => {
  dispatch({ type: KILL_CREATURE, payload: creature });
  if (creature.get('isBoss')) {
    const state = getState();
    const currentGameLevel = state.get('currentGameLevel');
    const totalLevels = state.get('totalLevels');

    if (currentGameLevel === totalLevels) dispatch({ type: 'WIN_GAME' });
  }
};
