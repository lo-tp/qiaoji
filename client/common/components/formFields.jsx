import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import TextField from 'material-ui/TextField';

const renderTextField = ({ intl: { formatMessage }, input, label,
  meta: { touched, error }, ...custom }) =>
(
  <TextField
    hintText = { formatMessage(label) }
    floatingLabelText = { formatMessage(label) }
    errorText = { touched && error && formatMessage(error) }
    { ...input }
    { ...custom }
  />
);

renderTextField.propTypes = {
  intl: intlShape.isRequired,
  input: PropTypes.object,
  label: PropTypes.object,
  meta: PropTypes.object,
  custom: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export const RenderTextField = injectIntl(renderTextField);
