import Immutable from 'immutable';
import { QUIZZES, META, PREVIEW, NEW_ITEM, ANSWERS, TITLE, CONTENT } from './action';
import { SET } from '../action';

export const quizInitialState = {
  newItem: { preview: false, title: '', content: '' },
  meta: Immutable.Map({
    pages: Immutable.List(),
    pageCount: -1,
    pageNumber: 1,
  }),
  quizzes: Immutable.Map(),
  answers: Immutable.Map(),
};

const answers = (state = {}, { flag, arg }) => {
  switch (flag) {
    case SET:
      return state.set(arg.name, arg.value);
    default:
      return state;
  }
};

const quizzes = (state = {}, { flag, arg }) => {
  switch (flag) {
    case SET:
      return state.set(arg.name, arg.value);
    default:
      return state;
  }
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
    case QUIZZES:
      return { ...state, quizzes: quizzes(state.quizzes, action) };
    case ANSWERS:
      return { ...state, answers: answers(state.answers, action) };
    default:
      return state;
  }
};

export default reducer;
