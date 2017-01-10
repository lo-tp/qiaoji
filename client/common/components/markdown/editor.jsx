import TextField from 'material-ui/TextField';
import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Preview from './preview';

const Editor = ({ preview, intl: { formatMessage: fm }, content,
  onChange }) =>
(
  <div >
    <TextField
      value = { content }
      style = { {
        width: '100%',
        display: preview ? 'none' : 'inline-block',
      } }
      rows = { 2 }
      onChange = { onChange }
      floatingLabelText = { fm({ id: 'textField.quizContent' }) }
      multiLine = { true }
    />
    <Preview
      preview = { preview }
      content = { content }
    />
  </div>
);

Editor.propTypes = {
  preview: PropTypes.bool,
  intl: intlShape.isRequired,
  content: PropTypes.string,
  onChange: PropTypes.func,
};

export default injectIntl(Editor);
