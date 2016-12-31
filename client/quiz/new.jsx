import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import AppBar from '../common/components/appBar';
import Editor from '../common/components/markdown/editor';
import { setNewPreview, setNewContent, setNewTitle } from './action';
import { shrinkStyle, noShrinkStyle, parentStyle } from '../common/styles';
import { injectIntl, intlShape } from 'react-intl';

const m = ({ preview, intl: { formatMessage: fm } }) => (
  <IconMenu
    iconButtonElement = { <IconButton><MoreVertIcon color = 'white' /></IconButton> }
    anchorOrigin = { { horizontal: 'right', vertical: 'top' } }
    targetOrigin = { { horizontal: 'right', vertical: 'top' } }
  >
    <MenuItem
      onTouchTap = { preview }
      primaryText = { fm({ id: 'menu.preview' }) }
    />
    <MenuItem primaryText = { fm({ id: 'menu.save' }) } />
  </IconMenu>
);
m.propTypes = {
  intl: intlShape.isRequired,
};
const menu = connect(
  ({ app: { quiz: { newItem: { preview } } } }) => ({
    status: preview,
  }),
  dispatch => ({
    preview: status => dispatch(setNewPreview(status)),
  }),
  (stateProps, dispatchProps) => ({
    preview: () => dispatchProps.preview(!stateProps.status),
  })
)(injectIntl(m));

const n = ({ intl: { formatMessage: fm }, preview, title,
  content, changeContent, changeTitle }) =>
(
  <div
    style = { parentStyle }
  >
    <AppBar
      title = 'menu.frontEnd'
      Menu = { menu }
    />
    <TextField
      style = { {
        width: '100%',
        ...noShrinkStyle,
      } }
      onChange = { changeTitle }
      floatingLabelText = { fm({ id: 'textField.quizTitle' }) }
    />
    <div
      style = { shrinkStyle }
    >
      <Editor
        preview = { preview }
        onChange = { changeContent }
        content = { content }
      />
    </div>
  </div>
);

n.propTypes = {
  preview: PropTypes.bool,
  intl: intlShape.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  changeContent: PropTypes.func,
  changeTitle: PropTypes.func,
};

export default connect(
  ({ app: { quiz: { newItem: { preview, title, content } } } }) => ({
    title,
    preview,
    content,
  }),
  dispatch => ({
    changeContent: event => dispatch(setNewContent(event.target.value)),
    changeTitle: event => dispatch(setNewTitle(event.target.value)),
  }),
)(injectIntl(n));
