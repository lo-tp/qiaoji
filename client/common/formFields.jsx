import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

// eslint-disable-next-line import/prefer-default-export
export const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText = { label }
    floatingLabelText = { label }
    errorText = { touched && error }
    { ...input }
    { ...custom }
  />
);

renderTextField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  custom: PropTypes.object,
};
