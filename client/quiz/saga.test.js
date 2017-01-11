// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';

// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import SERVER_URL, { PAGE_NUMBER } from 'app-config';

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
import { editOrCreateAnswer, getPageContent, getPageCountAndGetFirstPage } from './saga';
import { setQuizzes } from './action';
import { sagaTestHelper } from '../common/utilities/testTool';

const tools = require('../common/utilities/tool');

const assert = chai.assert;

const reqheaders = {
  Accept: 'application/json',
  'Content-type': 'application/json',
  cookieid: 'fake cookie id',
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
    nock(SERVER_URL, {
      reqheaders,
    })
    .get('/functions/quiz/pageCount')
    .query({
      belong: 0,
    })
    .reply(500);
    await sagaTestHelper(getPageCountAndGetFirstPage({ belong: 0 }), store);
    const { app } = store.getState();

    assert.isTrue(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.deepEqual(app.ui.snackbarMessage, { id: 'failure.getPageCount' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageCount' });
  });
  it('status: 200', async () => {
    nock(SERVER_URL, {
      reqheaders,
    })
    .get('/functions/quiz/pageCount')
    .query({
      belong: 0,
    })
    .reply(200, { pageNumber: 10086 });
    const actions = await sagaTestHelper(
      getPageCountAndGetFirstPage({ belong: 0 }), store);
    const { app } = store.getState();

    assert.isFalse(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageCount' });
    assert.deepEqual(actions[actions.length - 2], { belong: 0, type: 'GET_QUIZ_ONE_PAGE', pageNumber: 1 });
    assert.equal(app.quiz.meta.get('pageCount'), 10086);
  });
  it('status 200 filtered by user', async () => {
    nock(SERVER_URL, {
      reqheaders,
    })
    .get('/functions/quiz/pageCount')
    .query({
      belong: 1,
    })
    .reply(200, { pageNumber: 10086 });
    const actions = await sagaTestHelper(
      getPageCountAndGetFirstPage({ belong: 1 }), store);
    const { app } = store.getState();

    assert.isFalse(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getPageCount' });
    assert.deepEqual(actions[actions.length - 2], { belong: 1, type: 'GET_QUIZ_ONE_PAGE', pageNumber: 1 });
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
    nock(SERVER_URL, {
      reqheaders,
    })
    .get(path)
    .query({
      pageNumber: 0,
      belong: 0,
    })
    .reply(500);
    await sagaTestHelper(getPageContent({ pageNumber: 1 }), store);
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

    nock(SERVER_URL, {
      reqheaders,
    })
    .get(path)
    .query({
      belong: 0,
      pageNumber: 0,
    })
    .reply(200, {
      quizzes,
      pageNumber: 1,
      count: PAGE_NUMBER,
    });
    await sagaTestHelper(getPageContent({ pageNumber: 1 }), store);
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
  it('status: 200: filtered by user', async () => {
    const quizzes = [];
    for (let i = 0; i < PAGE_NUMBER; i += 1) {
      quizzes.push({
        _id: i,
        content: `content ${i}`,
        title: `title ${i}`,
      });
    }

    nock(SERVER_URL, {
      reqheaders,
    })
    .get(path)
    .query({
      pageNumber: 0,
      belong: 1,
    })
    .reply(200, {
      quizzes,
      pageNumber: 1,
      count: PAGE_NUMBER,
    });
    await sagaTestHelper(getPageContent({ pageNumber: 1, belong: 1 }), store);
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
  after(() => {
    tools.getCid.restore();
  });
});

describe('editOrCreateAnswer', () => {
  const path = '/functions/answer/';
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

  it('validation: no request should be made when the content is invalid', async () => {
    await sagaTestHelper(editOrCreateAnswer({
      create: true,
      content: '',
      quizId: 'quiz id',
    }), store);
    const { app: { ui } } = store.getState();

    assert.isTrue(ui.snackbarVisible);
    assert.isFalse(ui.progressDialogVisible);
    assert.deepEqual(ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.deepEqual(ui.snackbarMessage, { id: 'validation.general' });
  });
  it('create new answer:status 500', async () => {
    nock(SERVER_URL, {
      reqheaders,
    })
    .put(`${path}new`, {
      content: 'answer content',
      quizId: 'quiz id',
    })
    .reply(500);
    await sagaTestHelper(editOrCreateAnswer({
      create: true,
      content: 'answer content',
      quizId: 'quiz id',
    }), store);
    const { app } = store.getState();

    assert.isTrue(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.deepEqual(app.ui.snackbarMessage, { id: 'failure.createAnswer' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.createAnswer' });
  });
  it('create new answer:status 200', async () => {
    const quizId = 'quiz id';
    nock(SERVER_URL, {
      reqheaders,
    })
    .put(`${path}new`, {
      content: 'answer content',
      quizId,
    })
    .reply(200, { result: 1, answerId: 'answer' });
    store.dispatch(setQuizzes({
      name: quizId,
      value: {},
    }));
    const actions = await sagaTestHelper(editOrCreateAnswer({
      create: true,
      content: 'answer content',
      quizId: 'quiz id',
    }), store);
    const { app } = store.getState();
    const { quiz: { quizzes, answers } } = app;

    assert.isFalse(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.createAnswer' });

    assert.equal(quizzes.get(quizId).answerId, 'answer');
    assert.equal(answers.get('answer').content, 'answer content');
    assert.equal(answers.get('answer')._id, 'answer');
    assert.deepEqual(actions[actions.length - 2], { type: 'BROWSER_HISTORY', purpose: 'GO_BACK' });
  });

  it('edit existing answer:status 500', async () => {
    nock(SERVER_URL, {
      reqheaders,
    })
    .post(`${path}edit`, {
      content: 'answer content',
      answerId: 'answer id',
    })
    .reply(500);
    await sagaTestHelper(editOrCreateAnswer({
      create: false,
      content: 'answer content',
      quizId: 'quiz id',
      answerId: 'answer id',
    }), store);
    const { app } = store.getState();

    assert.isTrue(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.deepEqual(app.ui.snackbarMessage, { id: 'failure.editAnswer' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.editAnswer' });
  });

  it('edit existing answer:status 200', async () => {
    const quizId = 'quiz id';
    const answerId = 'answer id';
    nock(SERVER_URL, {
      reqheaders,
    })
    .post(`${path}edit`, {
      content: 'answer content',
      answerId,
    })
    .reply(200, { result: 1, answerId });
    store.dispatch(setQuizzes({
      name: quizId,
      value: {},
    }));
    const actions = await sagaTestHelper(editOrCreateAnswer({
      create: false,
      content: 'answer content',
      quizId,
      answerId,
    }), store);
    const { app } = store.getState();
    const { quiz: { quizzes, answers } } = app;

    assert.isFalse(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.editAnswer' });

    assert.equal(quizzes.get(quizId).answerId, answerId);
    assert.equal(answers.get(answerId).content, 'answer content');
    assert.equal(answers.get(answerId)._id, answerId);
    assert.deepEqual(actions[actions.length - 2], { type: 'BROWSER_HISTORY', purpose: 'GO_BACK' });
  });
});
