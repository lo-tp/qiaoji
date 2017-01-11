import { QUESTION } from './action';

export const questionInitialState = {
  questions: [],
};

const reducer = (state = {}, action) => {
  const { target, arg } = action;
  switch (target) {
    case QUESTION:
      return { ...state, questions: arg };
    default:
      return state;
  }
};

export default reducer;
