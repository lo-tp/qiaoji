import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';

const snackbar = ({ intl: { formatMessage: fm },
                  open, msg, btnMsg, operation }) =>
(
  <Snackbar
    open = { open }
    message = { fm(msg) }
    action = { fm(btnMsg) }
    onActionTouchTap = { operation }
  />
);
snackbar.propTypes = {
  open: PropTypes.bool,
  msg: PropTypes.object.isRequired,
  btnMsg: PropTypes.object.isRequired,
  operation: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default connect(
  state => ({
    open: state.app.ui.snackbarVisible,
    msg: state.app.ui.snackbarMessage,
    btnMsg: state.app.ui.snackbarBtnMessage,
    operation: state.app.ui.snackbarOperation,
  }),
  dispatch => ({
    temp: operation => operation(dispatch),
  }),
  (stateProps, dispatchProps) => ({
    ...stateProps,
    operation: () => dispatchProps.temp(stateProps.operation),
  }),
)(injectIntl(snackbar));
