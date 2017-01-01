import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import New from './new';
import List from './list/component';
import onLeave from './onLeave';

const Quiz = (
  <Route
    path = 'quiz'
  >
    <IndexRedirect to = 'list' />
    <Route
      path = 'list'
      component = { List }
    />
    <Route
      path = 'new'
      onLeave = { onLeave.newPage }
      component = { New }
    />
  </Route>
);

export default Quiz;
