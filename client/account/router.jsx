import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import Login from './login';

const Account = (
  <Route
    path = 'account'
  >
    <IndexRedirect to = 'login' />
    <Route
      path = 'login'
      component = { Login }
    />
  </Route>
);

export default Account;
