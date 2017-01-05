// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';
import createSegaMiddleware from 'redux-saga';
import { applyMiddleware, createStore } from 'redux';
import 'babel-polyfill';

import Reducer from '../reducer';
import sagaManager from '../sagaManager';

describe('getPageCount: get page number', () => {
  before(async () => {
    const sagaMiddleware = createSegaMiddleware();
    const middlewares = applyMiddleware(sagaMiddleware);
    const store = middlewares(createStore)(Reducer);
    sagaManager.startSagas(sagaMiddleware);
  });
});
