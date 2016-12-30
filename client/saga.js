import { put, takeLatest } from 'redux-saga/effects';
import { setUi, SHOW_CLOSABLE_SNAKBAR } from './action';

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

export default [watch];
