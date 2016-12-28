import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';

const snackbar = ({ open, msg, btnMsg, operation }) =>
(
  <Snackbar
    open = { open }
    message = { msg }
    action = { btnMsg }
    onActionTouchTap = { operation }
  />
);
snackbar.propTypes = {
  open: PropTypes.bool,
  msg: PropTypes.string.isRequired,
  btnMsg: PropTypes.string.isRequired,
  operation: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    open: state.ui.snackbarVisible,
    msg: state.ui.snackbarMessage,
    btnMsg: state.ui.snackbarBtnMessage,
    operation: state.ui.snackbarOperation,
  }),
  dispatch => ({
    temp: operation => operation(dispatch),
  }),
  (stateProps, dispatchProps) => ({
    ...stateProps,
    operation: () => dispatchProps.temp(stateProps.operation),
  }),
)(snackbar);
