import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { SET, UI } from './action';

const uiInitialState = {
  tabValue: 0,
  progressDialogVisible: false,
  snackbarVisible: false,
  snackbarMessage: { id: 'failure.login' },
  snackbarBtnMessage: { id: 'failure.login' },
  progressDialogText: { id: 'ing.login' },
  drawerVisible: true,
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
});

export default Reducer;
