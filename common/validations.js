import validator from 'validator';

const validations = {
  lastName: ({ errors, values }) => {
    if (values.lastName === undefined || !validator.isAlpha(values.lastName)) {
      return {
        values,
        errors: { ...errors, lastName: 'Last name is not valid' },
      };
    }

    return { errors, values };
  },
  firstName: ({ errors, values }) => {
    if (values.firstName === undefined || !validator.isAlpha(values.firstName)) {
      return {
        values,
        errors: { ...errors, firstName: 'First name is not valid' },
      };
    }

    return { errors, values };
  },
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
