import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import Study from './study';
import onEnter from './onEnter';

const Question = (
  <Route
    path = 'question'
  >
    <IndexRedirect to = 'study' />
    <Route
      path = 'study'
      component = { Study }
    >
      <IndexRedirect to = 'normal' />
      <Route
        path = 'goOver'
        onEnter = { onEnter.goOver }
      />
      <Route
        path = 'normal'
        onEnter = { onEnter.normal }
      />
    </Route>
  </Route>
);

export default Question;
