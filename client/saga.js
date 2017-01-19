import 'whatwg-fetch';
import { browserHistory } from 'react-router';
import { race, call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { setUi, SHOW_CLOSABLE_SNAKBAR } from './action';
import { loginSignupTimeout } from '../common/constant';

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

// eslint-disable-next-line  require-yield
function* browserHistoryOperation({ purpose, url }) {
  if (purpose === 'GO_BACK') {
    browserHistory.go(-1);
  } else if (purpose === 'REDIRECT') {
    browserHistory.push(url);
  }
}

function* watch() {
  yield takeLatest(SHOW_CLOSABLE_SNAKBAR, tem);
  yield takeLatest('BROWSER_HISTORY', browserHistoryOperation);
}

// eslint-disable-next-line require-yield
export function* unauthorizeHandler() {
  browserHistory.push('/account');
  removeCpsItem('cookieId');
  removeCpsItem('user');
  yield call(closableSnackbarMsg, 'failure.unauthorized');
}

// eslint-disable-next-line require-yield
export function* authorize(res) {
  return res.status !== 401;
}

export function* authorizedOperation({ req, operationName, successHandler }) {
  try {
    yield put(setUi({
      progressDialogText: { id: `ing.${operationName}` },
    }));
    yield put(setUi({
      progressDialogVisible: true,
    }));
    const { res } = yield race({
      res: call(fetch, req),
      timeout: call(delay, loginSignupTimeout),
    });
    if (res) {
      if (yield call(authorize, res)) {
        yield call(successHandler, res);
      } else {
        yield call(unauthorizeHandler);
      }
    } else {
      yield closableSnackbarMsg(`timeout.${operationName}`);
    }
  } catch (e) {
    // eslint-disable-next-line
    console.info(e);
    yield closableSnackbarMsg(`failure.${operationName}`);
  } finally {
    yield put(setUi({
      progressDialogVisible: false,
    }));
  }
}

export default [watch];
