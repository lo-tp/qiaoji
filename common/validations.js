import validator from 'validator';

const hasWhiteSpace = s => /\s/g.test(s);

const validations = {
  lastName: ({ errors, values }) => {
    if (values.lastName === undefined ||
        hasWhiteSpace(values.lastName) ||
        !validator.isAlpha(values.lastName)) {
      return {
        values,
        errors: { ...errors, lastName: { id: 'validation.lastNameInvalid' } },
      };
    }

    return { errors, values };
  },

  firstName: ({ errors, values }) => {
    if (values.firstName === undefined ||
        hasWhiteSpace(values.firstName) ||
        !validator.isAlpha(values.firstName)) {
      return {
        values,
        errors: { ...errors, firstName: { id: 'validation.firstNameInvalid' } },
      };
    }

    return { errors, values };
  },

  userName: ({ errors, values }) => {
    if (values.userName === undefined ||
        hasWhiteSpace(values.userName) ||
        !validator.isEmail(values.userName)) {
      return {
        values,
        errors: { ...errors, userName: { id: 'validation.userNameInvalid' } },
      };
    }

    return { errors, values };
  },

  password: ({ errors, values }) => {
    if (values.password === undefined ||
        hasWhiteSpace(values.password) ||
        validator.isAlpha(values.password) ||
        validator.isNumeric(values.password) || values.password.length < 7) {
      return {
        values,
        errors: { ...errors, password: { id: 'validation.passwordInvalid' } },
      };
    }

    return { errors, values };
  },
};

export default validations;
