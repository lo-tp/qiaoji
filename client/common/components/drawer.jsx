import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import { setUi } from '../../action';

const drawer = ({ close, open, intl: { formatMessage: fm }, children }) => (
  <div >
    <Drawer
      docked = { false }
      open = { open }
      onRequestChange = { close }
    >
      <MenuItem>{ fm({ id: 'menu.frontEnd' }) }</MenuItem>
      <MenuItem>{ fm({ id: 'menu.logout' }) }</MenuItem>
    </Drawer>
    {children}
  </div>
);

drawer.propTypes = {
  intl: intlShape.isRequired,
  children: PropTypes.element,
  open: PropTypes.bool,
  close: PropTypes.func,
};

export default connect(
  state => ({
    open: state.app.ui.drawerVisible,
  }),
  dispatch => ({
    close: () => dispatch(setUi({ drawerVisible: false })),
  })
)(injectIntl(drawer));
