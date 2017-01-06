import validator from 'validator';
import Ramda from 'ramda';

const hasWhiteSpace = s => /\s/g.test(s);

const validations = {
  pageNumber: ({ errors, values }) => {
    if (values.pageNumber === undefined ||
        !validator.isNumeric(values.pageNumber)) {
      return {
        values,
        errors: { ...errors, pageNumber: { id: 'validation.pageNumberInvalid' } },
      };
    }
    return { errors, values };
  },

  content: ({ errors, values }) => {
    if (values.content === undefined ||
        validator.isEmpty(values.content)) {
      return {
        values,
        errors: { ...errors, content: { id: 'validation.contentInvalid' } },
      };
    }

    return { errors, values };
  },

  title: ({ errors, values }) => {
    if (values.title === undefined ||
        validator.isEmpty(values.title)) {
      return {
        values,
        errors: { ...errors, title: { id: 'validation.titleInvalid' } },
      };
    }

    return { errors, values };
  },

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

export const quizValidation = Ramda.compose(validations.title,
                                            validations.content);

export default validations;
