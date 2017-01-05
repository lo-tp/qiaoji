// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'app-config';
import { browserHistory } from 'react-router';
import { select, call, takeLatest } from 'redux-saga/effects';
import { getCid } from '../common/utilities/tool';
import { authorizedOperation, closableSnackbarMsg } from '../saga';
import { quizValidation } from '../../common/validations';

const postReqTemplate = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

// eslint-disable-next-line require-yield
function* validateItem(values) {
  const { content, title } = quizValidation({ errors: {}, values }).errors;
  if (content || title) {
    return false;
  }

  return true;
}

const selectNewItem = state => state.app.quiz.newItem;

function* newQuestion() {
  const { content, title } = yield select(selectNewItem);
  if (yield call(validateItem, { content, title })) {
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
    yield call(authorizedOperation, {
      req,
      operationName: 'createNewQuiz',
      * successHandler(res) {
        if (res.status === 500) {
          yield closableSnackbarMsg('failure.createNewQuiz');
        } else {
          browserHistory.go(-1);
          yield closableSnackbarMsg('success.createNewQuiz');
        }
      },
    });
  } else {
    yield closableSnackbarMsg('validation.general');
  }
}

function* watch() {
  yield takeLatest('NEW_QESTION', newQuestion);
}

export default [watch];
