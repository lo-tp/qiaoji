import { PREVIEW, NEW_ITEM, TITLE, CONTENT } from './action';

export const quizInitialState = {
  newItem: { preview: false, title: '', content: '' },
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
    default:
      return state;
  }
};

export default reducer;
