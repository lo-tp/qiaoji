import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { browserHistory } from 'react-router';
import mkd from 'markdown';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Back from 'material-ui/svg-icons/navigation/chevron-left';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import AppBar from '../common/components/appBar';
import Editor from '../common/components/markdown/editor';
import { shrinkStyle, parentStyle } from '../common/styles';
import { setNewPreview, setNewContent, setNewTitle } from './action';

const GoBack = () => (
  <Back
    onTouchTap = {
      () => browserHistory.push('/functions/quiz/list')
    }
    color = 'white'
  />
);

const m = ({ preview, save, intl: { formatMessage: fm } }) => (
  <IconMenu
    iconButtonElement = { <IconButton><MoreVertIcon color = 'white' /></IconButton> }
    anchorOrigin = { { horizontal: 'right', vertical: 'top' } }
    targetOrigin = { { horizontal: 'right', vertical: 'top' } }
  >
    <MenuItem
      onTouchTap = { preview }
      primaryText = { fm({ id: 'menu.preview' }) }
    />
    <MenuItem
      primaryText = { fm({ id: 'menu.save' }) }
      onTouchTap = { save }
    />
  </IconMenu>
);
m.propTypes = {
  intl: intlShape.isRequired,
  preview: PropTypes.func,
  save: PropTypes.func,
};
const menu = connect(
  ({ app: { quiz: { newItem: { preview } } } }) => ({
    status: preview,
  }),
  dispatch => ({
    preview: status => dispatch(setNewPreview(status)),
    save: () => dispatch({ type: 'NEW_QESTION' }),
  }),
  (stateProps, dispatchProps) => ({
    ...dispatchProps,
    preview: () => dispatchProps.preview(!stateProps.status),
  })
)(injectIntl(m));
const Quiz = ({ title, content }) =>
  (
    <Card>
      <CardHeader
        actAsExpander = { true }
        title = { title } subtitle = 'Lotp'
      />
      <CardText
        expandable = { true }
      >
        <div
          style = { {
            overflowY: 'hidden',
            maxHeight: 300,
          } }

        // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML = {
          { __html: mkd.markdown.toHTML(content) }
        }
        />
      </CardText>
    </Card>
  );

Quiz.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

const n = ({ preview, content, changeContent }) =>
(
  <div
    style = { parentStyle }
  >
    <AppBar
      title = 'menu.frontEnd'
      Menu = { menu }
      LeftBtn = { GoBack }
    />
    <div
      style = { shrinkStyle }
    >
      <Quiz
        title = 'title'
        content = 'content'
      />
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
  content: PropTypes.string,
  changeContent: PropTypes.func,
};

export default connect(
  ({ app: { quiz: { newItem: { preview, title, content } } } }) => ({
    title,
    preview,
    content,
  }),
  dispatch => ({
    changeContent: event => dispatch(setNewContent(event.target.value.trim())),
    changeTitle: event => dispatch(setNewTitle(event.target.value.trim())),
  }),
)(injectIntl(n));
