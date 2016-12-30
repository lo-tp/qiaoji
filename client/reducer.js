import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { SET, UI, TEM } from './action';

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

const Reducer = combineReducers({
  form: reduxFormReducer,
  ui,
  tem,
});

export default Reducer;
