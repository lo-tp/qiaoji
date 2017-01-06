// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';

// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL, { PAGE_NUMBER } from 'app-config';

// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon';
import { runSaga } from 'redux-saga';
import { createStore } from 'redux';

// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import 'babel-polyfill';
import Immutable from 'immutable';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'isomorphic-fetch';

import Reducer from '../reducer';
import { getPageContent, getPageCountAndGetFirstPage } from './saga';

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

    getState: store.getState,
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
  after(() => {
    tools.getCid.restore();
  });
});

describe('getPageContent: get one page of quizzes', () => {
  const path = '/functions/quiz/page/content';
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
    .get(path)
    .reply(500);
    await sagaTestHelper(getPageContent(), store);
    const { app } = store.getState();

    assert.isTrue(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.deepEqual(app.ui.snackbarMessage, { id: 'failure.getPageContent' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageContent' });
  });
  it('status: 200', async () => {
    const quizzes = [];
    for (let i = 0; i < PAGE_NUMBER; i += 1) {
      quizzes.push({
        _id: i,
        content: `content ${i}`,
        title: `title ${i}`,
      });
    }

    nock(SERVER_URL)
    .get(path, {
      pageNumber: 0,
    })
    .reply(200, {
      quizzes,
      pageNumber: 1,
      count: PAGE_NUMBER,
    });
    await sagaTestHelper(getPageContent(), store);
    const { app } = store.getState();

    assert.isFalse(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageContent' });
    assert.equal(app.quiz.meta.get('pageNumber'), 1);
    assert.deepEqual(app.quiz.meta.get('pages'), Immutable.List(quizzes.map(q => q._id)));
    quizzes.forEach(q => {
      const _id = q._id;
          // eslint-disable-next-line no-param-reassign
      delete q._id;
      assert.deepEqual(app.quiz.quizzes.get(_id), q);
    });
  });
});
