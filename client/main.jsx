import ReactDOM from 'react-dom';
import React from 'react';

import HelloWorld from './greeting';

const Main = () => (
  <div >
    <HelloWorld />
  </div>
);

ReactDOM.render(
  <Main />,
  document.getElementById('root'),
);
