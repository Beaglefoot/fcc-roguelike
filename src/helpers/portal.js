import { getRandomPlacementPosition } from './player';

export const placePortal = state => (
  (position => state.set('portal', position))(getRandomPlacementPosition(state))
);
