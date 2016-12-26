import { AppContainer } from 'react-hot-loader';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactDOM from 'react-dom';
import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import injectTapEventPlugin from 'react-tap-event-plugin';

import AppRouter from './router';
import Reducer from './reducer';


const logger = createLogger();
const store = createStore(
  Reducer,
  applyMiddleware(logger)
);

injectTapEventPlugin();

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
