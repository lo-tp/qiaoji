import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import SignupForm from './signupForm';
import LoginForm from './loginForm/component';

const TabsExampleSimple = () => (
  <Tabs>
    <Tab label = 'Signup' >
      <SignupForm />
    </Tab>
    <Tab label = 'Login' >
      <LoginForm />
    </Tab>
  </Tabs>
);

export default TabsExampleSimple;
