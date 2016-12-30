import React from 'react';
import { Route, IndexRedirect } from 'react-router';
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
    </div>
  </Route>
);

export default Quiz;
