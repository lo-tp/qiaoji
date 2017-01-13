  // eslint-disable-next-line import/no-extraneous-dependencies
import { AppContainer } from 'react-hot-loader';
import 'babel-polyfill';
import createSegaMiddleware from 'redux-saga';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactDOM from 'react-dom';
import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { addLocaleData, IntlProvider } from 'react-intl';
import zhLocaleData from 'react-intl/locale-data/zh';
import zhTranslation from '../common/i18n/zh';

import AppRouter from './router';
import Reducer from './reducer';
import sagaManager from './sagaManager';

const sagaMiddleware = createSegaMiddleware();
const logger = createLogger();
const middlewares = applyMiddleware(logger, sagaMiddleware);
// const middlewares = applyMiddleware(sagaMiddleware);
const store = middlewares(createStore)(Reducer);
addLocaleData(zhLocaleData);

injectTapEventPlugin();

sagaManager.startSagas(sagaMiddleware);

let translation = zhTranslation;

const rootEl = document.getElementById('root');
ReactDOM.render(
  <IntlProvider
    locale = 'zh'
    messages = { translation }
  >
    <MuiThemeProvider >
      <Provider
        store = { store }
      >
        <AppContainer>
          <AppRouter
            store = { store }
          />
        </AppContainer>
      </Provider>
    </MuiThemeProvider>
  </IntlProvider>,
  rootEl,
);

if (module.hot) {
  module.hot.accept('./sagaManager', () => {
    sagaManager.cancelSagas(store);

    // eslint-disable-next-line global-require
    require('./sagaManager').default.startSagas(sagaMiddleware);
  });
  module.hot.accept('./reducer', () => {
    // eslint-disable-next-line global-require
    store.replaceReducer(require('./reducer').default);
  });
  module.hot.accept('../common/i18n/zh', () => {
    // eslint-disable-next-line global-require
    translation = require('../common/i18n/zh').default;
    ReactDOM.render(
      <IntlProvider
        locale = 'zh'
        messages = { translation }
      >
        <MuiThemeProvider >
          <Provider
            store = { store }
          >
            <AppContainer>
              <AppRouter
                store = { store }
              />
            </AppContainer>
          </Provider>
        </MuiThemeProvider>
      </IntlProvider>,
     rootEl,
    );
  });
  module.hot.accept('./router', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./router').default;
    ReactDOM.render(
      <IntlProvider
        locale = 'zh'
        messages = { translation }
      >
        <MuiThemeProvider >
          <Provider
            store = { store }
          >
            <AppContainer>
              <NextApp
                store = { store }
              />
            </AppContainer>
          </Provider>
        </MuiThemeProvider>
      </IntlProvider>,
      rootEl,
    );
  });
}
