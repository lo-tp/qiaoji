import { race, put, call, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'config';
import { setUi } from '../action';
import { removeCpsItem, saveCpsItem } from '../common/utilities/localStorage';
import { loginSignupTimeout } from '../../common/constant';

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

function* signup(action) {
  try {
    // eslint-disable-next-line no-param-reassign
    delete action.type;
    yield put(setUi({
      progressDialogText: { id: 'ing.signup' },
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
    const { res } = yield race({
      res: call(fetch, req),
      timeout: call(delay, loginSignupTimeout),
    });
    if (res) {
      if (res.status === 500) {
        const { reason } = yield res.json();
        if (reason) {
          yield showResult('failure.signup');
        } else {
          yield showResult('failure.signupAccountUsed');
        }
      } else {
        yield showResult('success.signup',
                      dispatch => {
                        dispatch(setUi({ snackbarVisible: false }));
                        dispatch(setUi({ tabValue: 0 }));
                      });
      }
    } else {
      yield showResult('timeout.signup');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e);
    yield showResult('failure.signup');
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
    yield put(setUi({
      progressDialogText: { id: 'ing.login' },
    }));
    yield put(setUi({
      progressDialogVisible: true,
    }));
    const req = new Request(
      `${SERVER_URL}/login`,
      {
        ...postReqTemplate,
        body: JSON.stringify(action),
      },
    );
    const { res } = yield race({
      res: call(fetch, req),
      timeout: call(delay, loginSignupTimeout),
    });
    if (res) {
      if (res.status === 500) {
        yield showResult('failure.loginWrongInfo');
        removeCpsItem('cookieId');
      } else {
        const { cid } = yield res.json();
        saveCpsItem('cookieId', cid);
        yield showResult('success.login');
      }
    } else {
      yield showResult('timeout.login');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e);
    removeCpsItem('cookieId');
    yield showResult('failure.login');
  } finally {
    yield put(setUi({
      progressDialogVisible: false,
    }));
  }
}

function* watchLogin() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(SIGNUP, signup);
}

export default [watchLogin];
