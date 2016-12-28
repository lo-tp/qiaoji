import React, { PropTypes } from 'react';
import Ramda from 'ramda';
import { reduxForm } from 'redux-form';
import validations from '../../../common/validations';
import { LastName, FirstName,
  Submit, UserName, Password } from './common/fields';

import { SIGNUP } from '../saga';

const validate = values => (
  Ramda.compose(validations.password,
                validations.userName,
                validations.firstName,
                validations.lastName,
               )({ errors: {}, values }).errors
);
const onSubmit = (values, dispatch) => {
  dispatch({
    type: SIGNUP,
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
    <FirstName />
    <LastName />
    <UserName />
    <Password />
    <Submit
      label = 'Signup'
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
  form: 'signup',
  onSubmit,
  validate,
  initialValues: {
    userName: 'qqdsjfl@tc.com',
    password: 'www@sina.com',
    firstName: 'first',
    lastName: 'last',
  },
})(loginForm);
