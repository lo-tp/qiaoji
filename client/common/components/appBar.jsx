import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import { setUi } from '../../action';
import { noShrinkStyle } from '../styles';

const appBar = ({ Menu, title, leftHandler, intl: { formatMessage: fm } }) => (
  <AppBar
    style = { {...noShrinkStyle} }
    title = { fm({ id: title }) }
    onLeftIconButtonTouchTap = { leftHandler }
    iconElementRight = { <Menu /> }
  />
);

appBar.propTypes = {
  title: PropTypes.string,
  intl: intlShape.isRequired,
  leftHandler: PropTypes.func,
  Menu: PropTypes.func,
};

export default connect(
  null,
  dispatch => ({
    leftHandler: () => dispatch(setUi({ drawerVisible: true })),
  })
)(injectIntl(appBar));
