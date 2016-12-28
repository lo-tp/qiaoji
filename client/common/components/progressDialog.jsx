import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

const progressDialog = ({ open, title }) =>
(
  <Dialog
    title = { title }
    modal = { false }
    open = { open }
    // open = { false }
    bodyStyle = { { position: 'relative' } }
    style = { {
      textAlign: 'center',
    } }
  >
    <CircularProgress />
  </Dialog>
);
progressDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
};

export default connect(
  state => ({
    open: state.ui.progressDialogVisible,
    title: state.ui.progressDialogText,
  }),
)(progressDialog);
