import React, { PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import AppBar from '../common/components/appBar';

const m = ({ preview, intl: { formatMessage: fm } }) => (
  <IconMenu
    iconButtonElement = { <IconButton><MoreVertIcon color = 'white' /></IconButton> }
    anchorOrigin = { { horizontal: 'right', vertical: 'top' } }
    targetOrigin = { { horizontal: 'right', vertical: 'top' } }
  >
    <MenuItem
      onTouchTap = { preview }
      primaryText = { fm({ id: 'menu.preview' }) }
    />
    <MenuItem primaryText = { fm({ id: 'menu.save' }) } />
  </IconMenu>
);

m.propTypes = {
  intl: intlShape.isRequired,
  preview: PropTypes.func,
};
const menu = connect(
  ({ app: { quiz: { newItem: { preview } } } }) => ({
    status: preview,
  }),
  dispatch => ({
    preview: status => console.info('hel'),
  }),
  (stateProps, dispatchProps) => ({
    preview: () => dispatchProps.preview(!stateProps.status),
  })
)(injectIntl(m));

const List = () => (
  <div >
    <AppBar
      Menu = { menu }
      title = 'menu.frontEnd'
    />
    <h1 >
      hellllllllllllllllllllllllll
    </h1>
  </div>
);

export default List;
