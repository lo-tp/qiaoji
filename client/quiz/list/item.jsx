import React from 'react';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { injectIntl, intlShape } from 'react-intl';

const style = {
  margin: 12,
};

const item = ({ intl: { formatMessage: fm } }) => (
  <Card>
    <CardHeader
      actAsExpander = { true }
      title = 'What is Box Model When We Are Talking About CSS?' subtitle = 'Lotp'
    />
    <CardText
      expandable = { true }
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
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
        label = { fm({ id: 'btn.add' }) }
        secondary = { true }
        style = { style }
      />
    </CardActions>
  </Card>
);

item.propTypes = {
  intl: intlShape.isRequired,
};

export default connect()(injectIntl(item));
