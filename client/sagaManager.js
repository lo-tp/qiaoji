import { take, fork, cancel } from 'redux-saga/effects';

// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import { DEV } from 'app-config';
import accountSagas from './account/saga';
import quizSagas from './quiz/saga';
import questionSagas from './question/saga';
import commonSagas from './saga';

const sagas = [...quizSagas, ...accountSagas, ...commonSagas, ...questionSagas];

export const CANCEL_SAGAS_HMR = 'CANCEL_SAGAS_HMR';

function createAbortableSaga(saga) {
  if (DEV) {
    return function* main() {
      const sagaTask = yield fork(saga);

      yield take(CANCEL_SAGAS_HMR);
      yield cancel(sagaTask);
    };
  }

  return saga;
}

const SagaManager = {
  startSagas(sagaMiddleware) {
    sagas.map(createAbortableSaga).forEach(saga => sagaMiddleware.run(saga));
  },

  cancelSagas(store) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR,
    });
  },
};

export default SagaManager;
