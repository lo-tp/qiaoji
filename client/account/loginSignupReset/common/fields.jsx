import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Field } from 'redux-form';
import { renderTextField } from '../../../common/formFields';
import { fullWidth } from './styles';
import { trim } from '../../../../common/normalizations';


export const Submit = ({ pristine, submitting, invalid, label }) => (
  <RaisedButton
    type = 'submit'
    disabled = { pristine || submitting || invalid }
    label = { label }
    primary = { true }
    style = { {
      ...fullWidth,
      marginTop: '2rem',
    } }
  />
);

Submit.propTypes = {
  label: PropTypes.string,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
};

export const UserName = () => (
  <Field
    normalize = { trim }
    name = 'userName'
    component = { renderTextField }
    label = 'Email Address'
    style = { fullWidth }
  />
);
export const Password = () => (
  <Field
    normalize = { trim }
    name = 'password'
    component = { renderTextField }
    label = 'Password'
    style = { fullWidth }
  />
);
