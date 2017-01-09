import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import New from './new';
import AnswerEditor from './editAnswer';
import List from './list/component';
import onLeave from './onLeave';
import onEnter from './onEnter';

const Quiz = (
  <Route
    path = 'quiz'
  >
    <IndexRedirect to = 'list' />
    <Route
      path = 'list'
      onEnter = { onEnter.list }
      component = { List }
    />
    <Route
      path = 'list'
      component = { List }
    >
      <IndexRedirect to = 'all' />
      <Route
        path = 'all'
        onEnter = { onEnter.all }
      />
      <Route
        path = 'filteredByUser'
        onEnter = { onEnter.filteredByUser }
      />
    </Route>
    <Route
      path = 'answer'
      component = { AnswerEditor }
    >
      <Route
        path = 'new'
      />
      <Route
        path = 'edit'
      />
    </Route>
    <Route
      path = 'new'
      onLeave = { onLeave.newPage }
      component = { New }
    />
  </Route>
);

export default Quiz;
