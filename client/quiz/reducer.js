import Immutable from 'immutable';
import { PAGE_ALL, PAGE_MINE, EDITING,
  QUIZ_ID, QUIZZES, META, ANSWER_ID,
  PREVIEW, NEW_ITEM, ANSWERS, TITLE, CONTENT } from './action';
import { SET } from '../action';

export const quizInitialState = {
  item: {
    preview: false,
    title: '',
    content: '',
    editing: false,
  },
  meta: {
    currentPage: PAGE_ALL,
    mine: Immutable.Map({
      pages: [],
      count: -1,
      pageNumber: 1,
    }),
    all: Immutable.Map({
      user: 'all',
      pages: [],
      count: -1,
      pageNumber: 1,
    }),
  },
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
      return state.set(arg.key, arg.value);
    default:
      return state;
  }
};

const mine = (state, { arg }) => state.set(arg.key, arg.value);
const all = (state, { arg }) => state.set(arg.key, arg.value);

const meta = (state = {}, { flag, arg }) => {
  switch (flag) {
    case SET:
      return { ...state, ...arg };
    case PAGE_ALL:
      return { ...state, all: all(state.all, { arg }) };
    case PAGE_MINE:
      return { ...state, mine: mine(state.mine, { arg }) };
    default:
      return state;
  }
};

const item = (state = {}, { flag_1, arg }) => {
  switch (flag_1) {
    case TITLE:
      return { ...state, title: arg };
    case CONTENT:
      return { ...state, content: arg };
    case PREVIEW:
      return { ...state, preview: arg };
    case EDITING:
      return { ...state, editing: arg };
    case QUIZ_ID:
      return { ...state, quizId: arg };
    case ANSWER_ID:
      return { ...state, answerId: arg };
    default:
      return state;
  }
};

const reducer = (state = {}, action) => {
  const { target } = action;
  switch (target) {
    case NEW_ITEM:
      return { ...state, item: item(state.item, action) };
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
