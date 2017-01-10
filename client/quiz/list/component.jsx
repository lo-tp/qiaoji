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
import { shrinkStyle, parentStyle } from '../../common/styles';

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
  ({ app: { quiz: { item: { preview } } } }) => ({
    status: preview,
  }),
  () => ({
    preview: () => browserHistory.push('/functions/quiz/new'),
  }),
  (stateProps, dispatchProps) => ({
    preview: () => dispatchProps.preview(!stateProps.status),
  })
)(injectIntl(m));

const List = ({ list, pageCount, pageNumber, turnPage }) => (
  <div
    style = { parentStyle }
  >
    <AppBar
      Menu = { menu }
      title = 'menu.frontEnd'
    />
    <div
      style = { shrinkStyle }
    >
      {
        list.map((l, i) => (
          <Item
            key = { i }
            title = { l.title }
            content = { l.content }
          />
        ))
      }
      <Pagination
        total = { pageCount }
        display = { 7 }
        current = { pageNumber }
        onChange = { turnPage }
      />
    </div>
  </div>
);
List.propTypes = {
  pageCount: PropTypes.number,
  pageNumber: PropTypes.number,
  list: PropTypes.array,
  turnPage: PropTypes.func,
};

export default connect(
  state => {
    const { app: { quiz: { meta, quizzes } } } = state;
    const list = [];
    meta.get('pages').forEach(id => {
      list.push({
        id,
        ...quizzes.get(id),
      });
    });
    return {
      list,
      pageCount: meta.get('pageCount'),
      pageNumber: meta.get('pageNumber'),
    };
  },

  dispatch => ({
    turnPage: value => {
      dispatch({
        type: 'GET_QUIZ_ONE_PAGE',
        pageNumber: value,
      });
    },
  }))(List);
