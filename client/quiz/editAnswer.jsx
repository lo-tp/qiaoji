import React, { PropTypes } from 'react';
import showdown from 'showdown';
import { injectIntl, intlShape } from 'react-intl';
import { browserHistory } from 'react-router';
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
import { setItemPreview, setItemContent, setItemTitle } from './action';

const converter = new showdown.Converter();

const GoBack = () => (
  <Back
    onTouchTap = {
      () => browserHistory.go(-1)
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
  ({ app: { quiz:
    { item: { answerId, quizId, preview, content, editing } } } }) =>
  ({
    status: preview,
    content,
    editing,
    quizId,
    answerId,
  }),
  dispatch => ({
    preview: status => dispatch(setItemPreview(status)),
    save: action => {
      dispatch(action);
    },
  }),
  (stateProps, dispatchProps) => ({
    preview: () => dispatchProps.preview(!stateProps.status),
    save: () => dispatchProps.save(
      {
        type: 'EIDT_OR_CREATE_ANSWER',
        content: stateProps.content,
        create: !stateProps.editing,
        quizId: stateProps.quizId,
        answerId: stateProps.answerId,
      }),
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
          { __html: converter.makeHtml(content) }
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
  ({ app: { quiz: { item: { preview, title, content } } } }) => ({
    title,
    preview,
    content,
  }),
  dispatch => ({
    changeContent: event => dispatch(setItemContent(event.target.value.trim())),
    changeTitle: event => dispatch(setItemTitle(event.target.value.trim())),
  }),
)(injectIntl(n));
