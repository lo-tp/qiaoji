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
      component = { List }
    >
      <IndexRedirect to = 'all/1' />
      <Route
        path = ':user/:pageNumber'
        onEnter = { onEnter.checkQuizzes }
      />
    </Route>
    <Route
      path = 'answer'
      component = { AnswerEditor }
    >
      <Route
        path = 'new'
        onEnter = { onEnter.newAnswer }
      />
      <Route
        path = 'edit'
        onEnter = { onEnter.editAnswer }
      />
    </Route>
    <Route
      path = 'new'
      onLeave = { onLeave.newPage }
      onEnter = { onEnter.newQuiz }
      component = { New }
    />
  </Route>
);

export default Quiz;
