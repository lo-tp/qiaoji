import { DAY_IN_MINISECONDS } from './constant';

// eslint-disable-next-line import/prefer-default-export
export const getDaysSinceEpoch = () => (
Math.round(new Date().getTime() / DAY_IN_MINISECONDS)
);
