import { browserHistory } from 'react-router';
import { call, put, takeLatest } from 'redux-saga/effects';
import { setUi, SHOW_CLOSABLE_SNAKBAR } from './action';

import { removeCpsItem } from './common/utilities/localStorage';

const closeSnackbar = dispatch => dispatch(setUi({ snackbarVisible: false }));

export function* closableSnackbarMsg(msg, operation = closeSnackbar) {
  yield put(setUi({
    snackbarBtnMessage: { id: 'btn.close' },
  }));
  yield put(setUi({
    snackbarMessage: { id: msg },
  }));
  yield put(setUi({
    snackbarOperation: operation,
  }));
  yield put(setUi({
    snackbarVisible: true,
  }));
}

export function* tem({ arg: { msg, operation = closeSnackbar } }) {
  yield put(setUi({
    snackbarBtnMessage: { id: 'btn.close' },
  }));
  yield put(setUi({
    snackbarMessage: { id: msg },
  }));
  yield put(setUi({
    snackbarOperation: operation,
  }));
  yield put(setUi({
    snackbarVisible: true,
  }));
}

function* watch() {
  yield takeLatest(SHOW_CLOSABLE_SNAKBAR, tem);
}

// eslint-disable-next-line require-yield
export function* unauthorizeHandler() {
  browserHistory.push('/account');
  removeCpsItem('cookieId');
  yield call(closableSnackbarMsg, 'failure.unauthorized');
}

// eslint-disable-next-line require-yield
export function* authorize(res) {
  return res.status !== 401;
}

export default [watch];
