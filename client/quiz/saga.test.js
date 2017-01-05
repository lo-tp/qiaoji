// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';

// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'app-config';

// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon';
import { runSaga } from 'redux-saga';
import { createStore } from 'redux';

// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import 'babel-polyfill';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'isomorphic-fetch';

import Reducer from '../reducer';
import { getPageCountAndGetFirstPage } from './saga';

const tools = require('../common/utilities/tool');

const assert = chai.assert;

const sagaTestHelper = (saga, store) => {
  const actions = [];
  const task = runSaga(saga, {
    dispatch: action => {
      if (store) {
        store.dispatch(action);
        actions.push(action);
      }
    },
  });
  return task.done.then(() => actions);
};

describe('getPageCountAndGetFirstPage: get page number', () => {
  let store;

  before(async () => {
    store = createStore(Reducer);
    sinon.stub(tools, 'getCid', () => (
      'fake cookie id'
    ));
  });

  beforeEach(async () => {
    store.dispatch({
      type: 'RESET_STATE',
    });
  });
  it('status: 500', async () => {
    nock(SERVER_URL)
    .get('/functions/quiz/pageCount')
    .reply(500);
    await sagaTestHelper(getPageCountAndGetFirstPage(), store);
    const { app } = store.getState();

    assert.isTrue(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.deepEqual(app.ui.snackbarMessage, { id: 'failure.getPageCount' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageCount' });
  });
  it('status: 200', async () => {
    nock(SERVER_URL)
    .get('/functions/quiz/pageCount')
    .reply(200, { pageNumber: 10086 });
    const actions = await sagaTestHelper(getPageCountAndGetFirstPage(), store);
    const { app } = store.getState();

    assert.isFalse(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageCount' });
    assert.deepEqual(actions[actions.length - 2], { type: 'GET_ONE_PAGE_QUIZ' });
    assert.equal(app.quiz.meta.get('pageCount'), 10086);
  });
});
