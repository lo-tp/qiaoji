import { race, put, call, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { browserHistory } from 'react-router';
import 'whatwg-fetch';

// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'app-config';
import { removeCpsItem, saveCpsItem } from '../common/utilities/localStorage';
import { loginSignupTimeout } from '../../common/constant';
import { closableSnackbarMsg } from '../saga';
import { showClosableSnackBarMsg, setUi } from '../action';

export const LOGIN = 'LOGIN';
export const SIGNUP = 'SIGNUP';
export const RENEW_COOKIE = 'RENEW_COOKIE';
export const UNAUTHORIZED = 'UNAUTHORIZED';

const postReqTemplate = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};
function* gotoLoginAndRemoveCookie() {
  removeCpsItem('cookieId');
  browserHistory.push('/account');
  yield put(showClosableSnackBarMsg, {
    msg: 'failure.unauthorized',
  });
}

function* renewCookie({ cookieId }) {
  try {
    yield put(setUi({
      progressDialogText: { id: 'ing.login' },
    }));
    yield put(setUi({
      progressDialogVisible: true,
    }));
    const req = new Request(
      `${SERVER_URL}/renewCookie`,
      {
        ...postReqTemplate,
        body: JSON.stringify({ cookieId }),
      },
    );
    yield race({
      res: call(fetch, req),
      timeout: call(delay, loginSignupTimeout),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e);
  } finally {
    yield put(setUi({
      progressDialogVisible: false,
    }));
  }
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
          yield closableSnackbarMsg('failure.signup');
        } else {
          yield closableSnackbarMsg('failure.signupAccountUsed');
        }
      } else {
        yield closableSnackbarMsg('success.signup',
                      dispatch => {
                        dispatch(setUi({ snackbarVisible: false }));
                        dispatch(setUi({ tabValue: 0 }));
                      });
      }
    } else {
      yield closableSnackbarMsg('timeout.signup');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e);
    yield closableSnackbarMsg('failure.signup');
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
        yield closableSnackbarMsg('failure.loginWrongInfo');
        removeCpsItem('cookieId');
      } else {
        const { cid } = yield res.json();
        saveCpsItem('cookieId', cid);
        browserHistory.push('/');
        yield closableSnackbarMsg('success.login');
      }
    } else {
      yield closableSnackbarMsg('timeout.login');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e);
    removeCpsItem('cookieId');
    yield closableSnackbarMsg('failure.login');
  } finally {
    yield put(setUi({
      progressDialogVisible: false,
    }));
  }
}

function* watchLogin() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(SIGNUP, signup);
  yield takeLatest(RENEW_COOKIE, renewCookie);
  yield takeLatest(UNAUTHORIZED, gotoLoginAndRemoveCookie);
}

export default [watchLogin];
