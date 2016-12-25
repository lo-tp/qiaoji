import validator from 'validator';

export const loginSignUpFormValidation = values => {
  const errors = {};
  if (values.userName === undefined || !validator.isEmail(values.userName)) {
    errors.userName = 'Email address is not valid';
  }

  if (values.password === undefined || validator.isAlpha(values.password) ||
      validator.isNumeric(values.password) || values.password.length < 7) {
    errors.password = 'Password has to a string containing both letter and digit longer than 8';
  }

  return errors;
};
