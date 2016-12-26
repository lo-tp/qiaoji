import validator from 'validator';

const validations = {
  userName: ({ errors, values }) => {
    if (values.userName === undefined || !validator.isEmail(values.userName)) {
      return {
        values,
        errors: { ...errors, userName: 'Email address is not valid' },
      };
    }

    return { errors, values };
  },

  password: ({ errors, values }) => {
    if (values.password === undefined || validator.isAlpha(values.password) ||
        validator.isNumeric(values.password) || values.password.length < 7) {
      return {
        values,
        errors: { ...errors, password: 'Password has to a string containing both letter and digit longer than 8' },
      };
    }

    return { errors, values };
  },
};

export default validations;
