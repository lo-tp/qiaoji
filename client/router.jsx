import React from 'react';
import { IndexRedirect, browserHistory, Router, Route } from 'react-router';
import Account from './account/router';

const routes = (
  <Route
    path = '/'
  >
    <IndexRedirect
      to = 'account'
    />
    {Account}
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
