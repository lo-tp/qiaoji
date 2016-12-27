import { take, fork, cancel } from 'redux-saga/effects';
import { DEV } from 'config';
import accountSagas from './account/saga';

const sagas = [...accountSagas];

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
