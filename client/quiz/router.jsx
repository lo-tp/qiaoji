import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import New from './new';
import List from './list';

const Quiz = (
  <Route
    path = 'quiz'
  >
    <IndexRedirect to = 'list' />
    <div >
      <Route
        path = 'list'
        component = { List }
      />
      <Route
        path = 'new'
        component = { New }
      />
    </div>
  </Route>
);

export default Quiz;
