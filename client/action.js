import Ramda from 'ramda';

export const SET = 'SET';
export const UI = 'UI';

const actionArg = Ramda.curry((type, target, flag, flag_1, arg) => (
  {
    type, target, flag, flag_1, arg,
  }
));

export const action5 = actionArg;
export const action4 = action5(Ramda.__, Ramda.__, Ramda.__, 0, Ramda.__);
export const action3 = action4(Ramda.__, Ramda.__, 0, Ramda.__);
export const action2 = action3(Ramda.__, 0, Ramda.__);

export const setUi = action3(UI, SET, Ramda.__);
