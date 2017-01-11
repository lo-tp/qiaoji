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

// eslint-disable-next-line import/no-extraneous-dependencies
import 'isomorphic-fetch';

import Reducer from '../reducer';
import { sagaTestHelper } from '../common/utilities/testTool';
import { getQuestion } from './saga';

const tools = require('../common/utilities/tool');

const reqheaders = {
  Accept: 'application/json',
  'Content-type': 'application/json',
  cookieid: 'fake cookie id',
};

const assert = chai.assert;
const path = '/functions/question/';

describe('getQuestion', () => {
  let store;
  const redirectAction = {
    type: 'BROWSER_HISTORY',
    purpose: 'REDIRECT',
    url: '/functions/question/remember/normal',
  };

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
    .get(`${path}list`)
    .query({
      belong: 0,
    })
    .reply(500);
    const actions = await sagaTestHelper(getQuestion({ belong: 0 }), store);
    const { app } = store.getState();

    assert.isTrue(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.snackbarBtnMessage, { id: 'btn.close' });
    assert.deepEqual(app.ui.snackbarMessage, { id: 'failure.getQuestion' });
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getQuestion' });
    assert.notDeepEqual(actions[actions.length - 2], redirectAction);
  });
  it('status: 200', async () => {
    const questions = [];
    for (let index = 0; index < 10; index += 1) {
      questions.push({
        id: index,
        dueDate: index,
        update: index,
        interval: index,
        quiz: {
          content: `content ${index}`,
          title: `title ${index}`,
        },
        answer: {
          content: `answer content ${index}`,
        },
      });
    }

    nock(SERVER_URL, {
      reqheaders,
    })
    .get(`${path}list`)
    .query({
      belong: 0,
    })
    .reply(200, { questions });
    const actions = await sagaTestHelper(getQuestion({ belong: 0 }), store);
    const { app } = store.getState();

    assert.isFalse(app.ui.snackbarVisible);
    assert.isFalse(app.ui.progressDialogVisible);
    assert.deepEqual(app.ui.progressDialogText, { id: 'ing.getQuestion' });
    assert.deepEqual(actions[actions.length - 2], redirectAction);
    assert.deepEqual(questions, app.question.questions);
  });
});
