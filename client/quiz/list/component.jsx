import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Pagination from 'material-ui-pagination';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import AppBar from '../../common/components/appBar';
import Item from './item';
// import Pagination from './pagination';

const m = ({ preview, intl: { formatMessage: fm } }) => (
  <IconMenu
    iconButtonElement = { <IconButton><MoreVertIcon color = 'white' /></IconButton> }
    anchorOrigin = { { horizontal: 'right', vertical: 'top' } }
    targetOrigin = { { horizontal: 'right', vertical: 'top' } }
  >
    <MenuItem
      onTouchTap = { preview }
      primaryText = { fm({ id: 'menu.add' }) }
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
  () => ({
    preview: () => browserHistory.push('/functions/quiz/new'),
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
    <Item />
    <Item />
    <Item />
    <Pagination
      total = { 100 }
      display = { 7 }
      current = { 13 }
      onChange = { v => console.info(v) }
    />
  </div>
);

export default List;
