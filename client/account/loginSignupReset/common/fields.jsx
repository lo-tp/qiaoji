import { injectIntl, intlShape } from 'react-intl';
import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Field } from 'redux-form';
import { RenderTextField } from '../../../common/components/formFields';
import { fullWidth } from './styles';
import { trim } from '../../../../common/normalizations';

const submit = ({ intl, pristine, submitting, invalid, label }) => (
  <RaisedButton
    type = 'submit'
    disabled = { pristine || submitting || invalid }
    label = { intl.formatMessage(label) }
    primary = { true }
    style = { {
      ...fullWidth,
      marginTop: '2rem',
    } }
  />
);

submit.propTypes = {
  intl: intlShape.isRequired,
  label: PropTypes.object,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
};

export const Submit = injectIntl(submit);

export const LastName = () => (
  <Field
    normalize = { trim }
    name = 'lastName'
    component = { RenderTextField }
    label = { { id: 'account.lastName' } }
    style = { fullWidth }
  />
);
export const FirstName = () => (
  <Field
    normalize = { trim }
    name = 'firstName'
    component = { RenderTextField }
    label = { { id: 'account.firstName' } }
    style = { fullWidth }
  />
);

export const UserName = () => (
  <Field
    normalize = { trim }
    name = 'userName'
    component = { RenderTextField }
    label = { { id: 'account.userName' } }
    style = { fullWidth }
  />
);
export const Password = () => (
  <Field
    normalize = { trim }
    name = 'password'
    component = { RenderTextField }
    label = { { id: 'account.password' } }
    style = { fullWidth }
  />
);
