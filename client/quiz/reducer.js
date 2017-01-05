import Immutable from 'immutable';
import { META, PREVIEW, NEW_ITEM, TITLE, CONTENT } from './action';
import { SET } from '../action';

export const quizInitialState = {
  newItem: { preview: false, title: '', content: '' },
  meta: Immutable.Map({
    pageCount: 1,
  }),
};

const meta = (state = {}, { flag, arg }) => {
  switch (flag) {
    case SET:
      return state.set(arg.name, arg.value);
    default:
      return state;
  }
};

const newItem = (state = {}, { flag_1, arg }) => {
  switch (flag_1) {
    case TITLE:
      return { ...state, title: arg };
    case CONTENT:
      return { ...state, content: arg };
    case PREVIEW:
      return { ...state, preview: arg };
    default:
      return state;
  }
};

const reducer = (state = {}, action) => {
  const { target } = action;
  switch (target) {
    case NEW_ITEM:
      return { ...state, newItem: newItem(state.newItem, action) };
    case META:
      return { ...state, meta: meta(state.meta, action) };
    default:
      return state;
  }
};

export default reducer;
