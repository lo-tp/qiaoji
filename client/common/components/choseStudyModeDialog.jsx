import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import { setUi } from '../../action';

const cancel = ({ close, intl: { formatMessage: fm } }) => (
  <FlatButton
    label = { fm({ id: 'btn.close' }) }
    primary = { true }
    onTouchTap = { close }
  />
);
cancel.propTypes = {
  intl: intlShape.isRequired,
  close: PropTypes.func,
};

const Cancel = connect(
  null,
  dispatch => ({
    close: () => dispatch(setUi({ choseStudyModeDialogVisible: false })),
  }),
)(injectIntl(cancel));
const Actions = [
  <Cancel />,
];

const choseStudyModeDialog = ({ dispatch, intl: { formatMessage: fm }, open }) =>
(
  <Dialog
    actions = { Actions }
    title = { fm({ id: 'dlgTitle.choseStudyMode' }) }
    modal = { false }
    open = { open }
    bodyStyle = { { position: 'relative' } }
    style = { {
      textAlign: 'center',
    } }
  >
    <Menu>
      <MenuItem
        primaryText = { fm({ id: 'menu.normal' }) }
        onTouchTap = { () => {
          dispatch({
            type: 'GET_QUESIONS',
            goOver: 0,
          });
          dispatch(setUi({ choseStudyModeDialogVisible: false }));
        } }
      />
      <MenuItem
        primaryText = { fm({ id: 'menu.goOver' }) }
        onTouchTap = { () => {
          dispatch({
            type: 'GET_QUESIONS',
            goOver: 1,
          });
          dispatch(setUi({ choseStudyModeDialogVisible: false }));
        } }
      />
    </Menu>
  </Dialog>
);
choseStudyModeDialog.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool,
  dispatch: PropTypes.func,
};

export default connect(
  state => ({
    open: state.app.ui.choseStudyModeDialogVisible,
  }),
  dispatch => ({
    dispatch: action => dispatch(action),
  }),
)(injectIntl(choseStudyModeDialog));
