import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { SET, UI } from './action';

const ui = (state = {}, action) => {
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
