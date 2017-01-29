import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { injectIntl, intlShape } from 'react-intl';
import { setChoiceDialog } from '../../action';

const Btn = ({ label, click }) => (
  <FlatButton
    label = { label }
    primary = { true }
    onTouchTap = { click }
  />
);
Btn.propTypes = {
  label: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired,
};

const dialog = ({ visible, text, title, leftBtnText, leftBtnAction,
  rightBtnText, rightBtnAction, intl: { formatMessage: fm }, dispatch }) => (
    <Dialog
      title = { fm(title) }
      actions = { [
        <Btn
          label = { fm(leftBtnText) }
          click = { () => {
            dispatch(leftBtnAction);
            dispatch(setChoiceDialog({ visible: false }));
          } }

        />,
        <Btn
          label = { fm(rightBtnText) }
          click = { () => dispatch(rightBtnAction) }
        />,
      ] }
      modal = { true }
      open = { visible }
    >
      { fm(text) }
    </Dialog>
);

dialog.propTypes = {
  intl: intlShape.isRequired,
  visible: PropTypes.bool,
  title: PropTypes.object,
  text: PropTypes.object,
  leftBtnAction: PropTypes.object,
  leftBtnText: PropTypes.object,
  rightBtnAction: PropTypes.object,
  rightBtnText: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(
  state => {
    const { app: {
      ui: {
      choiceDialog: {
        text,
        title,
        visible,
        leftBtnText,
        leftBtnAction,
        rightBtnText,
        rightBtnAction,
      } },
    } } = state;
    return {
      title,
      visible,
      text,
      leftBtnText,
      leftBtnAction,
      rightBtnText,
      rightBtnAction,
    };
  },

  dispatch => ({
    dispatch: action => dispatch(action),
  }),
)(injectIntl(dialog));
