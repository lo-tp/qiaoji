import { QUESTION, QUESTIONS } from './action';

export const questionInitialState = {
  questions: [],
};

const reducer = (state = {}, action) => {
  const { target, arg } = action;
  switch (target) {
    case QUESTIONS:
      return { ...state, questions: arg };
    case QUESTION:
      return { ...state, ...arg };
    default:
      return state;
  }
};

export default reducer;
