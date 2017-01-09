import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { injectIntl, intlShape } from 'react-intl';
import mkd from 'markdown';

const style = {
  margin: 12,
};

const item = ({ answer, title, content, intl: { formatMessage: fm } }) =>
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
          label = { fm({ id: answer === undefined ? 'btn.addAnswer' : 'btn.editAnswer' }) }
          secondary = { true }
          style = { style }
        />
      </CardActions>
    </Card>
  );

item.propTypes = {
  answer: PropTypes.object,
  intl: intlShape.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
};

export default connect()(injectIntl(item));
