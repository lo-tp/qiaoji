// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'app-config';
import 'whatwg-fetch';
import Immutable from 'immutable';
import { browserHistory } from 'react-router';
import { put, select, call, takeLatest } from 'redux-saga/effects';
import { authorizedOperation, closableSnackbarMsg } from '../saga';
import validations, { quizValidation } from '../../common/validations';
import { setAnswers, setMeta, setQuizzes } from './action';
import { getCid, getQueryString } from '../common/utilities/tool';

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

const selectNewItem = state => state.app.quiz.item;
const selectQuizzes = state => state.app.quiz.quizzes;

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
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          cookieId: getCid(),
        },
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

export function* getPageCountAndGetFirstPage({ belong = 0 }) {
  const query = {
    belong,
  };
  const req = new Request(
    `${SERVER_URL}/functions/quiz/pageCount?${getQueryString(query)}`,
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
    operationName: 'getPageCount',
    * successHandler(res) {
      if (res.status === 500) {
        yield closableSnackbarMsg('failure.getPageCount');
      } else {
        const { pageNumber } = yield res.json();
        yield put(
          setMeta({
            name: 'pageCount',
            value: pageNumber,
          })
        );
        yield put({
          type: 'GET_QUIZ_ONE_PAGE',
          pageNumber: 1,
          belong,
        });
      }
    },
  });
}

export function* getPageContent({ pageNumber, belong = 0 }) {
  const query = {
    pageNumber: pageNumber - 1,
    belong,
  };
  const req = new Request(
    `${SERVER_URL}/functions/quiz/page/content?${getQueryString(query)}`,
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
    operationName: 'getPageContent',
    * successHandler(res) {
      if (res.status === 500) {
        yield closableSnackbarMsg('failure.getPageContent');
      } else {
        const { count, quizzes } = yield res.json();
        const pages = [];
        const content = [];
        quizzes.forEach(q => {
          const _id = q._id;

          // eslint-disable-next-line no-param-reassign
          delete q._id;
          pages.push(_id);
          content.push(q);
        });
        for (let i = 0; i < count; i += 1) {
          yield put(
          setQuizzes({
            name: pages[i],
            value: content[i],
          }));
        }

        yield put(
          setMeta({
            name: 'pages',
            value: Immutable.List(pages),
          })
        );
        yield put(setMeta({
          name: 'pageNumber',
          value: pageNumber,
        }));
      }
    },
  });
}

export function* editOrCreateAnswer({ create, content, quizId, answerId }) {
  if (validations.content({ errors: {}, values: { content } }).errors.content) {
    yield closableSnackbarMsg('validation.general');
  } else {
    let path = 'edit';
    let method = 'POST';
    let operation = 'editAnswer';
    let body = JSON.stringify({
      content,
      answerId,
    });

    if (create) {
      path = 'new';
      method = 'PUT';
      operation = 'createAnswer';
      body = JSON.stringify({
        content,
        quizId,
      });
    }

    const req = new Request(
      `${SERVER_URL}/functions/answer/${path}`,
      {
        method,
        body,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          cookieId: getCid(),
        },
      }
    );
    yield call(authorizedOperation, {
      req,
      operationName: operation,
      * successHandler(res) {
        if (res.status === 500) {
          yield closableSnackbarMsg(`failure.${operation}`);
        } else {
          const quizzes = yield select(selectQuizzes);
          const quiz = quizzes.get(quizId);
          const { answerId: resultAnswerId } = yield res.json();
          quiz.answerId = resultAnswerId;
          yield put(setQuizzes({
            name: quizId,
            value: quiz,
          }));
          yield put(setAnswers({
            name: resultAnswerId,
            value: {
              _id: resultAnswerId,
              content,
            },
          }));
          yield put({
            type: 'BROWSER_HISTORY',
            purpose: 'GO_BACK' });
        }
      },
    });
  }
}

function* watch() {
  yield takeLatest('NEW_QESTION', newQuestion);
  yield takeLatest('GET_QUIZ_PAGE_COUNT', getPageCountAndGetFirstPage);
  yield takeLatest('GET_QUIZ_ONE_PAGE', getPageContent);
  yield takeLatest('EIDT_OR_CREATE_ANSWER', editOrCreateAnswer);
}

export default [watch];
