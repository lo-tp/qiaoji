import React, { PropTypes } from 'react';
import Ramda from 'ramda';
import { reduxForm } from 'redux-form';
import validations from '../../../../common/validations';
import { Submit, UserName, Password } from '../common/fields';
import { LOGIN } from '../../saga';

const validate = values => (
  Ramda.compose(validations.password, validations.userName)({ errors: {}, values }).errors
);
const onSubmit = (values, dispatch) => {
  dispatch({
    type: LOGIN,
    ...values,
  });
};

const styles = {
  form: {
    width: '340px',
    margin: '0 auto',
    textAlign: 'center',
  },
};

const loginForm = ({ handleSubmit, pristine, submitting, invalid }) => (
  <form
    onSubmit = { handleSubmit }
    style = { styles.form }
  >
    <UserName />
    <Password />
    <Submit
      label = 'Login'
      pristine = { pristine }
      submitting = { submitting }
      invalid = { invalid }
    />
  </form>
);

loginForm.propTypes = {
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
};

export default reduxForm({
  form: 'login',
  onSubmit,
  validate,
  initialValues: {
    userName: 'qqdsjfl@tc.com',
    password: 'www@sina.com',
  },
})(loginForm);
