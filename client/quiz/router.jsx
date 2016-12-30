import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import List from './list';
import Drawer from '../common/components/drawer';

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
