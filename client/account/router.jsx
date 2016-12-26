import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import LoginSignupReset from './loginSignupReset/component';

const Account = (
  <Route
    path = 'account'
  >
    <IndexRedirect to = 'loginSignupReset' />
    <Route
      path = 'loginSignupReset'
      component = { LoginSignupReset }
    />
  </Route>
);

export default Account;
