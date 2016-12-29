import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

const progressDialog = ({ intl: { formatMessage: fm }, open, title }) =>
(
  <Dialog
    title = { fm(title) }
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
  intl: intlShape.isRequired,
  open: PropTypes.bool,
  title: PropTypes.object,
};

export default connect(
  state => ({
    open: state.ui.progressDialogVisible,
    title: state.ui.progressDialogText,
  }),
)(injectIntl(progressDialog));
