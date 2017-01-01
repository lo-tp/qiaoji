// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'config';
import { select, race, put, call, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { loginSignupTimeout } from '../../common/constant';
import { getCid } from '../common/utilities/tool';
import { closableSnackbarMsg, unauthorizeHandler, authorize } from '../saga';
import { showClosableSnackBarMsg, setUi } from '../action';

const postReqTemplate = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const selectNewItem = state => state.app.quiz.newItem;
function* newQuestion() {
  const { content, title } = yield select(selectNewItem);
  const req = new Request(
    `${SERVER_URL}/functions/quiz/new`,
    {
      ...postReqTemplate,
      body: JSON.stringify({
        cookieId: getCid(),
        content,
        title,
      }),
    },
  );
  try {
    yield put(setUi({
      progressDialogText: { id: 'ing.createNewQuiz' },
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
        yield closableSnackbarMsg('success.createNewQuiz');
      } else {
        yield call(unauthorizeHandler);
      }
    } else {
      yield closableSnackbarMsg('timeout.createNewQuiz');
    }
  } catch (e) {
    yield closableSnackbarMsg('failure.createNewQuiz');
  } finally {
    yield put(setUi({
      progressDialogVisible: false,
    }));
  }
}

function* watch() {
  yield takeLatest('NEW_QESTION', newQuestion);
}

export default [watch];
