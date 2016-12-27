import { call, takeLatest } from 'redux-saga/effects';
  // eslint-disable-next-line max-len
  // eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'config';

export const LOGIN = 'LOGIN';

function* login(action) {
  try {
  // eslint-disable-next-line no-param-reassign
    delete action.type;
    const req = new Request(
      `${SERVER_URL}/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
}

export default [watchLogin];
