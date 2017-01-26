import { DAY_IN_MINISECONDS } from './constant';

// eslint-disable-next-line import/prefer-default-export
export const getDaysSinceEpoch = () => (
Math.round(new Date().getTime() / DAY_IN_MINISECONDS)
);
export const shuffle = array => {
  for (let i = array.length; i > 1; i -= 1) {
    const index = Math.floor(i * Math.random());
    const t = array[i - 1];

    // eslint-disable-next-line no-param-reassign
    array[i - 1] = array[index];

    // eslint-disable-next-line no-param-reassign
    array[index] = t;
  }
};
