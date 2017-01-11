import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { RESET_STATE, SET, UI, TEM } from './action';
import { QUIZ } from './quiz/action';
import { QUESTION } from './question/action';
import quiz, { quizInitialState } from './quiz/reducer';
import question, { questionInitialState } from './question/reducer';

const uiInitialState = {
  tabValue: 0,
  progressDialogVisible: false,
  snackbarVisible: false,
  snackbarMessage: { id: 'failure.login' },
  snackbarBtnMessage: { id: 'failure.login' },
  progressDialogText: { id: 'ing.login' },
  drawerVisible: false,
};

const tem = (state = {}, action) => {
  if (action.type === TEM && action.target === SET) {
    return { ...state, ...action.arg };
  }

  return state;
};

const ui = (state = { ...uiInitialState }, action) => {
  if (action.type === UI && action.target === SET) {
    return { ...state, ...action.arg };
  }

  return state;
};

const initialiState = {
  ui: uiInitialState,
  quiz: quizInitialState,
  question: questionInitialState,
};

const Reducer = (state = initialiState, action) => {
  const { type } = action;
  switch (type) {
    case RESET_STATE:
      return { ...initialiState };
    case UI:
      return { ...state, ui: ui(state.ui, action) };
    case TEM:
      return { ...state, tem: tem(state.tem, action) };
    case QUIZ:
      return { ...state, quiz: quiz(state.quiz, action) };
    case QUESTION:
      return { ...state, question: question(state.question, action) };
    default:
      return state;
  }
};

export default combineReducers({
  form: reduxFormReducer,
  app: Reducer,
});
