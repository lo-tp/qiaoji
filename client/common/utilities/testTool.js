import { runSaga } from 'redux-saga';

// eslint-disable-next-line import/prefer-default-export
export const sagaTestHelper = (saga, store) => {
  const actions = [];
  const task = runSaga(saga, {
    dispatch: action => {
      if (store) {
        store.dispatch(action);
        actions.push(action);
      }
    },

    getState: store.getState,
  });
  return task.done.then(() => actions);
};
