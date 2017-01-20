// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';

// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL from 'app-config';

// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon';
import { createStore } from 'redux';

// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import 'babel-polyfill';
import Immutable from 'immutable';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'isomorphic-fetch';

import Reducer from '../reducer';
import { getPageCount, goToPage, getPageContent1 as getPageContent } from './saga';
import { setMeta, setPageMineMeta, setPageAllMeta,
  PAGE_ALL, PAGE_MINE } from './action';
import { sagaTestHelper } from '../common/utilities/testTool';

const tools = require('../common/utilities/tool');

const assert = chai.assert;

const reqheaders = {
  Accept: 'application/json',
  'Content-type': 'application/json',
  cookieid: 'fake cookie id',
};

describe('goToPage', () => {
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
  it('count === -1, so getPageCount should be invoked', async () => {
    // for the logedin user
    store.dispatch(setMeta({
      currentPage: PAGE_MINE,
    }));
    let actions = await sagaTestHelper(goToPage(), store);
    assert.deepEqual(actions[actions.length - 1], { type: 'GET_QUIZ_PAGE_COUNT' });
    // for the all
    store.dispatch(setMeta({
      currentPage: PAGE_ALL,
    }));
    actions = await sagaTestHelper(goToPage(), store);
    assert.deepEqual(actions[actions.length - 1], { type: 'GET_QUIZ_PAGE_COUNT' });
  });
  it('count !== -1, so getPageContent should be invoked', async () => {
    // for the logedin user
    store.dispatch(setMeta({
      currentPage: PAGE_MINE,
    }));
    store.dispatch(setPageMineMeta({
      key: 'count',
      value: 10,
    }));
    let actions = await sagaTestHelper(goToPage(), store);
    assert.deepEqual(actions[actions.length - 1], { type: 'GET_QUIZ_PAGE_CONTENT' });
    // for the all
    store.dispatch(setMeta({
      currentPage: PAGE_ALL,
    }));
    store.dispatch(setPageAllMeta({
      key: 'count',
      value: 10,
    }));
    actions = await sagaTestHelper(goToPage(), store);
    assert.deepEqual(actions[actions.length - 1], { type: 'GET_QUIZ_PAGE_CONTENT' });
  });
  it('set pageNumber to 1 if the original bigger than the page count', async () => {
    // for the logedin user
    const lastAction = {
      type: 'BROWSER_HISTORY',
      purpose: 'REDIRECT',
      url: '/functions/quiz/list/all/1',
    };
    store.dispatch(setMeta({
      currentPage: PAGE_MINE,
    }));
    store.dispatch(setPageMineMeta({
      key: 'count',
      value: 10,
    }));
    store.dispatch(setPageMineMeta({
      key: 'pageNumber',
      value: 1234,
    }));
    store.dispatch(setPageMineMeta({
      key: 'user',
      value: 'user',
    }));
    let actions = await sagaTestHelper(goToPage(), store);
    assert.deepEqual(actions[actions.length - 1],
                     { ...lastAction, url: '/functions/quiz/list/user/1' });
    // for the all
    store.dispatch(setMeta({
      currentPage: PAGE_ALL,
    }));
    store.dispatch(setPageAllMeta({
      key: 'count',
      value: 10,
    }));
    store.dispatch(setPageAllMeta({
      key: 'pageNumber',
      value: 1000,
    }));
    actions = await sagaTestHelper(goToPage(), store);
    assert.deepEqual(actions[actions.length - 1], lastAction);
  });
  after(() => {
    tools.getCid.restore();
  });
});
describe('getPageCount', () => {
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
  it('status 500', async () => {
    // for the logedin user
    nock(SERVER_URL, {
      reqheaders,
    })
    .get('/functions/quiz/page/count/123')
    .reply(500);
    store.dispatch(setMeta({
      currentPage: PAGE_MINE,
    }));
    store.dispatch(setPageMineMeta({
      key: 'user',
      value: 123,
    }));
    await sagaTestHelper(getPageCount(), store);
    let { app } = store.getState();
    assert.isTrue(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.deepEqual(app.ui.snackbarMessage, { id: 'failure.getPageCount' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageCount' });

    // for the all
    nock(SERVER_URL, {
      reqheaders,
    })
    .get('/functions/quiz/page/count/all')
    .reply(500);
    store.dispatch(setMeta({
      currentPage: PAGE_ALL,
    }));
    store.dispatch({
      type: 'RESET_STATE',
    });
    await sagaTestHelper(getPageCount(), store);
    app = store.getState().app;
    assert.isTrue(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.deepEqual(app.ui.snackbarMessage, { id: 'failure.getPageCount' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageCount' });
  });
  it('status 200', async () => {
    // for the logedin user
    nock(SERVER_URL, {
      reqheaders,
    })
    .get('/functions/quiz/page/count/123')
    .reply(200, {
      count: 123879,
    });
    store.dispatch(setMeta({
      currentPage: PAGE_MINE,
    }));
    store.dispatch(setPageMineMeta({
      key: 'user',
      value: 123,
    }));
    let actions = await sagaTestHelper(getPageCount(), store);
    let { app } = store.getState();
    assert.isFalse(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.notDeepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.notDeepEqual(app.ui.snackbarMessage, { id: 'failure.getPageCount' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageCount' });
    assert.equal(app.quiz.meta.mine.get('count'), 123879);
    assert.deepEqual(actions[actions.length - 2], { type: 'GO_TO_QUIZ_OAGE' });

    // for the all
    nock(SERVER_URL, {
      reqheaders,
    })
    .get('/functions/quiz/page/count/all')
    .reply(200, {
      count: 86789,
    });
    store.dispatch(setMeta({
      currentPage: PAGE_ALL,
    }));
    store.dispatch({
      type: 'RESET_STATE',
    });
    actions = await sagaTestHelper(getPageCount(), store);
    app = store.getState().app;
    assert.isFalse(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.notDeepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.notDeepEqual(app.ui.snackbarMessage, { id: 'failure.getPageCount' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageCount' });
    assert.equal(app.quiz.meta.all.get('count'), 86789);
    assert.deepEqual(actions[actions.length - 2], { type: 'GO_TO_QUIZ_OAGE' });
  });
  after(() => {
    tools.getCid.restore();
  });
});
describe('getPageContent', () => {
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
  it('status 500', async () => {
    // for the logedin user
    nock(SERVER_URL, {
      reqheaders,
    })
    .get('/functions/quiz/page/content/123/1')
    .reply(500);
    store.dispatch(setMeta({
      currentPage: PAGE_MINE,
    }));
    store.dispatch(setPageMineMeta({
      key: 'user',
      value: 123,
    }));
    store.dispatch(setPageMineMeta({
      key: 'pageNumber',
      value: 1,
    }));
    store.dispatch(setPageMineMeta({
      key: 'count',
      value: 189,
    }));
    await sagaTestHelper(getPageContent(), store);
    let { app } = store.getState();
    assert.isTrue(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.deepEqual(app.ui.snackbarMessage, { id: 'failure.getPageContent' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageContent' });

    // for the all
    nock(SERVER_URL, {
      reqheaders,
    })
    .get('/functions/quiz/page/content/all/5')
    .reply(500);
    store.dispatch(setMeta({
      currentPage: PAGE_ALL,
    }));
    store.dispatch({
      type: 'RESET_STATE',
    });
    store.dispatch(setPageAllMeta({
      key: 'pageNumber',
      value: 5,
    }));
    store.dispatch(setPageAllMeta({
      key: 'count',
      value: 189,
    }));
    await sagaTestHelper(getPageContent(), store);
    app = store.getState().app;
    assert.isTrue(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.deepEqual(app.ui.snackbarMessage, { id: 'failure.getPageContent' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageContent' });
  });
  it('status 200', async () => {
    const pages = [];
    const quizzes = Immutable.Map({});
    const quizzesResponse = [];
    for (let i = 0; i < 18; i += 1) {
      const quiz = { _id: i, content: `content ${i}`, title: `title ${i}` };
      pages.push(quiz._id);
      quizzesResponse.push(quiz);
      quizzes.set(quiz._id, quiz);
    }
    // for the all
    nock(SERVER_URL, {
      reqheaders,
    })
    .get('/functions/quiz/page/content/all/5')
    .reply(200, {
      quizzes: quizzesResponse,
    });
    store.dispatch(setMeta({
      currentPage: PAGE_ALL,
    }));
    store.dispatch({
      type: 'RESET_STATE',
    });
    store.dispatch(setPageAllMeta({
      key: 'pageNumber',
      value: 5,
    }));
    store.dispatch(setPageAllMeta({
      key: 'count',
      value: 189,
    }));
    await sagaTestHelper(getPageContent(), store);
    let app = store.getState().app;
    assert.isFalse(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.notDeepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.notDeepEqual(app.ui.snackbarMessage, { id: 'failure.getPageContent' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageContent' });
    quizzesResponse.forEach(q => {
      assert.deepEqual(app.quiz.quizzes.get(q._id), q);
    });
    assert.deepEqual(app.quiz.meta.all.get('pages'), pages);
    // for the logined user
    nock(SERVER_URL, {
      reqheaders,
    })
    .get('/functions/quiz/page/content/123/5')
    .reply(200, {
      quizzes: quizzesResponse,
    });
    store.dispatch({
      type: 'RESET_STATE',
    });
    store.dispatch(setMeta({
      currentPage: PAGE_MINE,
    }));
    store.dispatch(setPageMineMeta({
      key: 'user',
      value: 123,
    }));
    store.dispatch(setPageMineMeta({
      key: 'pageNumber',
      value: 5,
    }));
    store.dispatch(setPageMineMeta({
      key: 'count',
      value: 189,
    }));
    await sagaTestHelper(getPageContent(), store);
    app = store.getState().app;
    assert.isFalse(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.notDeepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.notDeepEqual(app.ui.snackbarMessage, { id: 'failure.getPageContent' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageContent' });
    quizzesResponse.forEach(q => {
      assert.deepEqual(app.quiz.quizzes.get(q._id), q);
    });
    assert.deepEqual(app.quiz.meta.mine.get('pages'), pages);
  });
  after(() => {
    tools.getCid.restore();
  });
});
