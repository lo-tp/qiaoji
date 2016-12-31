import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { SET, UI, TEM } from './action';
import { QUIZ } from './quiz/action';
import quiz, { quizInitialState } from './quiz/reducer';

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

const Reducer = (state = {
  ui: uiInitialState,
  quiz: quizInitialState,
}, action) => {
  const { type } = action;
  switch (type) {
    case UI:
      return { ...state, ui: ui(state.ui, action) };
    case TEM:
      return { ...state, tem: tem(state.tem, action) };
    case QUIZ:
      return { ...state, quiz: quiz(state.quiz, action) };
    default:
      return state;
  }
};

export default combineReducers({
  form: reduxFormReducer,
  app: Reducer,
});
