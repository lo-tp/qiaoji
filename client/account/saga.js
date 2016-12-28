import { put, call, takeLatest } from 'redux-saga/effects';

// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'config';
import { setUi } from '../action';

export const LOGIN = 'LOGIN';
export const SIGNUP = 'SIGNUP';
const postReqTemplate = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};
const closeSnackbar = dispatch => dispatch(setUi({ snackbarVisible: false }));

function* showResult(msg, operation = closeSnackbar) {
  yield put(setUi({
    snackbarBtnMessage: 'close',
  }));
  yield put(setUi({
    snackbarMessage: msg,
  }));
  yield put(setUi({
    snackbarOperation: operation,
  }));
  yield put(setUi({
    snackbarVisible: true,
  }));
}

function* signup(action) {
  try {
    // eslint-disable-next-line no-param-reassign
    delete action.type;
    yield put(setUi({
      progressDialogText: 'Signing Up',
    }));
    yield put(setUi({
      progressDialogVisible: true,
    }));
    const req = new Request(
      `${SERVER_URL}/signup`,
      {
        ...postReqTemplate,
        body: JSON.stringify(action),
      },
    );
    const res = yield call(fetch, req);
    if (res.status === 500) {
      const { reason } = yield res.json();
      if (reason) {
        yield showResult('Failed to Sign Up');
      } else {
        yield showResult('This Email Has Been Used');
      }
    } else {
      yield showResult('Sign Up Successfully',
                      dispatch => {
                        dispatch(setUi({ snackbarVisible: false }));
                        dispatch(setUi({ tabValue: 0 }));
                      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e);
  } finally {
    yield put(setUi({
      progressDialogVisible: false,
    }));
  }
}

function* login(action) {
  try {
    // eslint-disable-next-line no-param-reassign
    delete action.type;
    const req = new Request(
      `${SERVER_URL}/login`,
      {
        ...postReqTemplate,
        body: JSON.stringify(action),
      },
    );
    const res = yield call(fetch, req);
    const data = yield res.json();
    console.info(data);
  } catch (e) {
    console.info(e);
  }
}

function* watchLogin() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(SIGNUP, signup);
}

export default [watchLogin];
