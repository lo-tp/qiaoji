import { reduxForm } from 'redux-form';
import LoginSignupForm from './common/loginSignupForm/component';
import { loginSignUpFormValidation } from '../../common/validation';
import { setUi } from '../action';

const onSubmit = (values, dispatch) => {
  dispatch(setUi({ formError: undefined }));
};

const onSubmitFail = (errors, dispatch) => {
  if (errors.userName !== undefined) {
    dispatch(setUi(
      { formError: errors.userName }));
  } else if (errors.password !== undefined) {
    dispatch(setUi(
      { formError: errors.password }));
  }
};

export default reduxForm({
  form: 'login',
  onSubmit,
  onSubmitFail,
  validate: loginSignUpFormValidation,
})(LoginSignupForm);
