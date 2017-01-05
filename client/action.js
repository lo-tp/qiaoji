import Ramda from 'ramda';

export const SET = 'SET';
export const UI = 'UI';
export const TEM = 'TEM';
export const SHOW_CLOSABLE_SNAKBAR = 'SHOW_CLOSABLE_SNAKBAR';
export const RESET_STATE = 'RESET_STATE';

// defCstAct

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
export const setTem = action3(TEM, SET, Ramda.__);
export const showClosableSnackBarMsg = action2(SHOW_CLOSABLE_SNAKBAR, Ramda.__);
