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

const appBar = ({ plainTitle, menuProp, LeftBtn = OpenDrawer, Menu, title,
  intl: { formatMessage: fm } }) =>
(
  <AppBar
    style = { { ...noShrinkStyle } }
    title = { plainTitle || fm({ id: title }) }
    iconElementLeft = { <IconButton><LeftBtn /></IconButton> }
    iconElementRight = { Menu ? <Menu otherProp = { menuProp } /> : null }
  />
);

appBar.propTypes = {
  LeftBtn: PropTypes.func,
  title: PropTypes.string,
  plainTitle: PropTypes.string,
  intl: intlShape.isRequired,
  Menu: PropTypes.func,
  menuProp: PropTypes.object,
};

export default connect(
  null,
  dispatch => ({
    leftHandler: () => dispatch(setUi({ drawerVisible: true })),
  })
)(injectIntl(appBar));
