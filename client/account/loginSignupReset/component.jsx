import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import SignupForm from './signupForm';
import LoginForm from './loginForm';
import { setUi } from '../../action';
import ProgressDialog from '../../common/components/progressDialog';
import Snackbar from '../../common/components/snackbar';

const tabsExampleSimple = ({ value, onChange }) => (
  <div>
    <ProgressDialog />
    <Snackbar />
    <Tabs
      value = { value }
      onChange = { onChange }
    >
      <Tab
        value = { 0 }
        label = 'Login'
      >
        <LoginForm />
      </Tab>
      <Tab
        label = 'Signup'
        value = { 1 }
      >
        <SignupForm />
      </Tab>
    </Tabs>
  </div>
);

tabsExampleSimple.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default connect(
  state => ({
    value: state.ui.tabValue,
  }),
  dispatch => ({
    onChange: value => dispatch(setUi({
      tabValue: value,
    })),
  }))(tabsExampleSimple);
