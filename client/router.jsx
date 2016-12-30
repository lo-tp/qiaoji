import React from 'react';
import { IndexRedirect, browserHistory, Router, Route } from 'react-router';
import Account from './account/router';
import Quiz from './quiz/router';
import Drawer from './common/components/drawer';

const routes = (
  <Route
    path = '/'
  >
    <IndexRedirect
      to = 'account'
    />
    {Account}
    <Route 
      component = { Drawer }
      path = 'functions'
    >
      {Quiz}
    </Route>
  </Route>
);

const AppRouter = () => (
  <Router
    history = { browserHistory }
    key = { new Date() }
    routes = { routes }
  />
);

export default AppRouter;
