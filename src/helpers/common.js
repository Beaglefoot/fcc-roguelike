import { Map } from 'immutable';
import random from 'lodash/random';

export const chooseAnother = (arrOfTwo = []) => (
  notThis => arrOfTwo.find(val => val !== notThis)
);

export const getRandomMapValue = (map = Map()) => (
  map.valueSeq().get(random(0, map.size - 1))
);

export const repeatFunc = (times = 1, fn, startValue) => (
  new Array(times).fill().reduce(res => fn(res), startValue)
);
