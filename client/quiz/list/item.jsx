import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { injectIntl, intlShape } from 'react-intl';
import mkd from 'markdown';
import { setItemQuizId } from '../action';

const style = {
  margin: 12,
};

const item = ({ editOrCreateAnswer, answer,
              title, content, intl: { formatMessage: fm } }) =>
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
      <CardActions
        expandable = { true }
      >
        <RaisedButton
          label = { fm({ id: 'btn.preview' }) }
          primary = { true }
          style = { style }
        />
        <RaisedButton
          label = { fm({ id: answer ? 'btn.addAnswer' : 'btn.editAnswer' }) }
          secondary = { true }
          style = { style }
          onTouchTap = {
            editOrCreateAnswer
          }
        />
      </CardActions>
    </Card>
  );

item.propTypes = {
  answer: PropTypes.object,
  intl: intlShape.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  editOrCreateAnswer: PropTypes.func,
};

export default connect(
  null,
  dispatch => ({
    setQuizId: id => dispatch(setItemQuizId(id)),
  }),
  (stateProps, dispatchProps, ownProps) => {
    const { quizId } = ownProps;
    console.info(ownProps.answer);
    return {
      ...ownProps,
      editOrCreateAnswer: () => {
        dispatchProps.setQuizId(quizId);
        if (ownProps.answer) {
          browserHistory.push('/functions/quiz/answer/edit');
        } else {
          browserHistory.push('/functions/quiz/answer/new');
        }
      },
    };
  })(injectIntl(item));
