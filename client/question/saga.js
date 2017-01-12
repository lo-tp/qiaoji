// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'app-config';
import { put, call, takeLatest } from 'redux-saga/effects';
import { authorizedOperation, closableSnackbarMsg } from '../saga';
import { getCid, getQueryString } from '../common/utilities/tool';
import { setQuestions } from './action';
import { setUi } from '../action';

// const selectNewItem = state => state.app.quiz.item;

export function* getQuestion({ goOver }) {
  const req = new Request(
    `${SERVER_URL}/functions/question/list?${getQueryString({ goOver })}`,
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

export function* updateQuestion({ questions }) {
  const req = new Request(
    `${SERVER_URL}/functions/question/update`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        cookieId: getCid(),
      },
      body: JSON.stringify({
        questions,
      }),
    }
  );
  yield call(authorizedOperation, {
    req,
    operationName: 'updateQuestion',
    * successHandler(res) {
      if (res.status === 500) {
        yield put(setUi({
          choiceDialog: {
            title: { id: 'dlgTitle.progressUpdateFailure' },
            text: { id: 'dlgText.progressUpdateFailure' },
            leftBtnText: { id: 'dlgBtnText.giveUp' },
            rightBtnText: { id: 'dlgBtnText.retry' },
            leftBtnAction: { type: 'BROWSER_HISTORY', purpose: 'GO_BACK' },
            rightBtnAction: { type: 'UPLOAD_PROGRESS', questions },
            visible: true,
          },
        }));
      } else {
        yield put(setQuestions([]));
        yield put({
          type: 'BROWSER_HISTORY',
          purpose: 'GO_BACK',
        });
      }
    },
  });
}

function* watch() {
  yield takeLatest('NEW_QESTION', getQuestion);
}

export default [watch];
