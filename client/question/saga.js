// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'app-config';
import { put, select, call, takeLatest } from 'redux-saga/effects';
import { authorizedOperation, closableSnackbarMsg } from '../saga';
import { getCid } from '../common/utilities/tool';
import { setQuestions } from './action';

const postReqTemplate = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

// const selectNewItem = state => state.app.quiz.item;

export function* getQuestion() {
  const req = new Request(
    `${SERVER_URL}/functions/question/list`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        cookieId: getCid(),
      },
    }
  );
  yield call(authorizedOperation, {
    req,
    operationName: 'getQuestion',
    * successHandler(res) {
      if (res.status === 500) {
        yield closableSnackbarMsg('failure.getQuestion');
      } else {
        const { questions } = yield res.json();
        yield put(setQuestions(questions));
        yield put({
          type: 'BROWSER_HISTORY',
          purpose: 'REDIRECT',
          url: '/functions/question/remember/normal',
        });
      }
    },
  });
}

function* watch() {
  yield takeLatest('NEW_QESTION', getQuestion);
}

export default [watch];
