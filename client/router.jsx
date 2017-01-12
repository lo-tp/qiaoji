import React, { PropTypes } from 'react';
import { createRoutes, IndexRedirect, browserHistory, Router, Route } from 'react-router';
import Account from './account/router';
import Question from './question/router';
import Quiz from './quiz/router';
import Drawer from './common/components/drawer';
import onEnter from './onEnter';
import ProgressDialog from './common/components/progressDialog';
import ChoseStudyModeDialog from './common/components/choseStudyModeDialog';
import ChoiceDialog from './common/components/twoChoiceDialog';
import Snackbar from './common/components/snackbar';

const msgComponent = ({ children }) => (
  <div
    style = { { height: '100%' } }
  >
    <ChoiceDialog />
    <ChoseStudyModeDialog />
    <ProgressDialog />
    <Snackbar />
    {children}
  </div>
);

msgComponent.propTypes = {
  children: PropTypes.element,
};

const injectStoreToRoutes = (store, routes) => (
    routes && routes.map(r => ({
      ...r,
      childRoutes: injectStoreToRoutes(store, r.childRoutes),
      onEnter: r.onEnter && r.onEnter(store),
      onLeave: r.onLeave && r.onLeave(store),
    }))
    );

const rawRoutes = (
  <Route
    path = '/'
    component = { msgComponent }
  >
    <IndexRedirect
      to = 'functions'
    />
    {Account}
    <Route
      onEnter = { onEnter.functions }
      component = { Drawer }
      path = 'functions'
    >
      <IndexRedirect
        to = 'quiz'
      />
      {Quiz}
      {Question}
    </Route>
  </Route>
);

const AppRouter = ({ store }) => (
  <Router
    history = { browserHistory }
    key = { new Date() }

    routes = { injectStoreToRoutes(store, createRoutes(rawRoutes)) }
  />
);

AppRouter.propTypes = {
  store: PropTypes.object,
};

export default AppRouter;
