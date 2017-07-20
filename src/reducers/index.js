import { world } from '../config';

const { rows, columns } = world;


class Tile {
  constructor(id, type = 'wall') {
    return { id, type };
  }
}

export const generateTiles = amount => (
  new Array(amount).fill().map(
    (_, index) => new Tile(index)
  )
);

const initialState = {
  rows,
  columns,
  tiles: generateTiles(rows * columns).map((tile, index) => index > 260 ? Object.assign(tile, { type: 'room' }) : tile)
};



const reducer = (state = initialState, action) => {
  if (!action) return state;

  return state;
};

export default reducer;
