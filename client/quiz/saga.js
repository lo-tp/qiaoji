// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'app-config';
import 'whatwg-fetch';
import Immutable from 'immutable';
import { put, select, call, takeLatest } from 'redux-saga/effects';
import { authorizedOperation, closableSnackbarMsg } from '../saga';
import validations, { quizValidation } from '../../common/validations';
import { setPageAllMeta, setPageMineMeta, PAGE_ALL, PAGE_MINE,
  setAnswers, setMeta, setQuizzes } from './action';
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
const selectCurrentPage = state => state.app.quiz.meta.currentPage;
const selectPageMeta = state => {
  const { quiz: { meta } } = state.app;
  switch (meta.currentPage) {
    case PAGE_ALL:
      return {
        pageMeta: meta.all,
        setPageMeta: setPageAllMeta,
      };
    default:
    case PAGE_MINE:
      return {
        pageMeta: meta.mine,
        setPageMeta: setPageMineMeta,
      };
  }
};

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
          yield put({
            type: 'BROWSER_HISTORY',
            purpose: 'GO_BACK' });
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

export function* goToPage() {
  const { pageMeta, setPageMeta } = yield select(selectPageMeta);
  const count = pageMeta.get('count');
  const pageNumber = pageMeta.get('pageNumber');
  if (count === -1) {
    yield put({
      type: 'GET_QUIZ_PAGE_COUNT',
    });
  } else if (pageNumber > count) {
    yield put({
      type: 'BROWSER_HISTORY',
      purpose: 'REDIRECT',
      url: `/functions/quiz/list/${pageMeta.get('user')}/1`,
    });
  } else {
    yield put(
        setPageMeta({
          key: 'pageNumber',
          value: parseInt(pageNumber, 10),
        }));
    yield put({
      type: 'GET_QUIZ_PAGE_CONTENT',
    });
  }
}

export function* getPageCount() {
  const { pageMeta, setPageMeta } = yield select(selectPageMeta);
  const user = pageMeta.get('user');
  const req = new Request(
    `${SERVER_URL}/functions/quiz/page/count/${user}`,
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
        const { count } = yield res.json();
        yield put(
          setPageMeta({
            key: 'count',
            value: count,
          }));
        yield put(
          {
            type: 'GO_TO_QUIZ_OAGE',
          });
      }
    },
  });
}

export function* getPageContent() {
  const { pageMeta, setPageMeta } = yield select(selectPageMeta);
  const user = pageMeta.get('user');
  const pageNumber = pageMeta.get('pageNumber');
  const req = new Request(
    `${SERVER_URL}/functions/quiz/page/content/${user}/${pageNumber}`,
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
        const { quizzes } = yield res.json();
        const pages = [];
        quizzes.forEach(q => {
          pages.push(q._id);
        });
        const totalNumber = quizzes.length;
        for (let i = 0; i < totalNumber; i += 1) {
          yield put(setQuizzes({
            key: pages[i],
            value: quizzes[i],
          }));
        }

        yield put(setPageMeta({
          key: 'pages',
          value: pages,
        }));
      }
    },
  });
}

function* redirect({ targetPage }) {
  const currentPage = yield select(selectCurrentPage);
  if (targetPage !== currentPage) {
    yield put(setMeta({
      currentPage: targetPage,
    }));
    const { pageMeta } = yield select(selectPageMeta);
    yield put({
      type: 'BROWSER_HISTORY',
      purpose: 'REDIRECT',
      url: `/functions/quiz/list/${pageMeta.get('user')}/${pageMeta.get('pageNumber')}`,
    });
  }
}

function* watch() {
  yield takeLatest('NEW_QESTION', newQuestion);
  // yield takeLatest('GET_QUIZ_PAGE_COUNT', getPageCountAndGetFirstPage);
  // yield takeLatest('GET_QUIZ_ONE_PAGE', getPageContent);
  yield takeLatest('EIDT_OR_CREATE_ANSWER', editOrCreateAnswer);

  yield takeLatest('GO_TO_QUIZ_OAGE', goToPage);
  yield takeLatest('GET_QUIZ_PAGE_COUNT', getPageCount);
  yield takeLatest('GET_QUIZ_PAGE_CONTENT', getPageContent);
  yield takeLatest('QUIZ_REDIRECT', redirect);
}

export default [watch];
