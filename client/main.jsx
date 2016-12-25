import { AppContainer } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';

import AppRouter from './router';
import Reducer from './reducer';


const logger = createLogger();
const store = createStore(
  Reducer,
  applyMiddleware(logger)
);


const rootEl = document.getElementById('root');
ReactDOM.render(
  <Provider
    store = { store }
  >
    <AppContainer>
      <AppRouter />
    </AppContainer>
  </Provider>,
  rootEl,
);

if (module.hot) {
  module.hot.accept('./router', () => {
    const NextApp = require('./router').default;
    ReactDOM.render(
      <Provider
        store = { store }
      >
        <AppContainer>
          <NextApp />
        </AppContainer>
      </Provider>,
     rootEl,
    );
  });
}
