export const chooseAnother = (arrOfTwo = []) => (
  notThis => arrOfTwo.find(val => val !== notThis)
);
