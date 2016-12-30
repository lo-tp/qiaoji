import { injectIntl, intlShape } from 'react-intl';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import SignupForm from './signupForm';
import LoginForm from './loginForm';
import { setUi } from '../../action';

const tabsExampleSimple = ({ intl, value, onChange }) => (
  <div>
    <Tabs
      inkBarStyle = { {
        height: 0,
      } }
      value = { value }
      onChange = { onChange }
    >
      <Tab
        style = { {
          position: 'relative',
          width: 170,
          left: '50%',
          marginLeft: -170,
        } }
        value = { 0 }
        label = { intl.formatMessage({ id: 'account.login' }) }
      >
        <LoginForm />
      </Tab>
      <Tab
        style = { {
          position: 'relative',
          width: 170,
          left: '50%',
        } }
        label = { intl.formatMessage({ id: 'account.signup' }) }
        value = { 1 }
      >
        <SignupForm />
      </Tab>
    </Tabs>
  </div>
);

tabsExampleSimple.propTypes = {
  intl: intlShape.isRequired,
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
  }))(injectIntl(tabsExampleSimple));
