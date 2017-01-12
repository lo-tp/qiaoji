import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuSvg from 'material-ui/svg-icons/navigation/menu';
import { setUi } from '../../action';
import { noShrinkStyle } from '../styles';

const openDrawer = ({ changeDrawer }) => (
  <MenuSvg
    onTouchTap = { changeDrawer }
    color = 'white'
  />
);
openDrawer.propTypes = {
  changeDrawer: PropTypes.func,
};

const OpenDrawer = connect(
  null,
  dispatch => ({
    changeDrawer: () => dispatch(setUi({ drawerVisible: true })),
  }),
)(openDrawer);

const appBar = ({ LeftBtn = OpenDrawer, Menu, title,
  intl: { formatMessage: fm } }) =>
(
  <AppBar
    style = { { ...noShrinkStyle } }
    title = { fm({ id: title }) }
    iconElementLeft = { <IconButton><LeftBtn /></IconButton> }
    iconElementRight = { Menu ? <Menu /> : null }
  />
);

appBar.propTypes = {
  LeftBtn: PropTypes.func,
  title: PropTypes.string,
  intl: intlShape.isRequired,
  Menu: PropTypes.func,
};

export default connect(
  null,
  dispatch => ({
    leftHandler: () => dispatch(setUi({ drawerVisible: true })),
  })
)(injectIntl(appBar));
