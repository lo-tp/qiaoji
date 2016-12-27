import { AppContainer } from 'react-hot-loader';
import createSegaMiddleware from 'redux-saga';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactDOM from 'react-dom';
import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import injectTapEventPlugin from 'react-tap-event-plugin';

import 'babel-polyfill';

import AppRouter from './router';
import Reducer from './reducer';
import sagaManager from './sagaManager';

const sagaMiddleware = createSegaMiddleware();
const logger = createLogger();
// const middlewares = applyMiddleware(logger, sagaMiddleware);
const middlewares = applyMiddleware(sagaMiddleware);
const store = middlewares(createStore)(Reducer);

injectTapEventPlugin();

sagaManager.startSagas(sagaMiddleware);

const rootEl = document.getElementById('root');
ReactDOM.render(
  <MuiThemeProvider >
    <Provider
      store = { store }
    >
      <AppContainer>
        <AppRouter />
      </AppContainer>
    </Provider>
  </MuiThemeProvider>,
  rootEl,
);

if (module.hot) {
  module.hot.accept('./sagaManager', () => {
    sagaManager.cancelSagas(store);

    // eslint-disable-next-line global-require
    require('./sagaManager').default.startSagas(sagaMiddleware);
  });
  module.hot.accept('./router', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./router').default;
    ReactDOM.render(
      <MuiThemeProvider >
        <Provider
          store = { store }
        >
          <AppContainer>
            <NextApp />
          </AppContainer>
        </Provider>
      </MuiThemeProvider>,
     rootEl,
    );
  });
}
