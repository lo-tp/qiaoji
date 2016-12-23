import { AppContainer } from 'react-hot-loader';
import ReactDOM from 'react-dom';
import React from 'react';

import HelloWorld from './greeting';

ReactDOM.render(
  <HelloWorld />,
  document.getElementById('root'),
);

const rootEl = document.getElementById('root');
ReactDOM.render(
  <AppContainer>
    <HelloWorld />
  </AppContainer>,
  rootEl,
);

if (module.hot) {
  module.hot.accept('./greeting', () => {
    const NextApp = require('./greeting').default;
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
     rootEl,
    );
  });
}
