import Ramda from 'ramda';
import { setItemTitle, setItemContent, startCreating, startEditing } from './action';

export default {
  // eslint-disable-next-line no-unused-vars
  all: Ramda.curry((store, previousState) => {
    store.dispatch({
      type: 'GET_QUIZ_PAGE_COUNT',
    });
  }),
  // eslint-disable-next-line no-unused-vars
  filteredByUser: Ramda.curry((store, previousState) => {
    store.dispatch({
      type: 'GET_QUIZ_PAGE_COUNT',
      belong: 1,
    });
  }),
  // eslint-disable-next-line no-unused-vars
  newAnswer: Ramda.curry((store, previousState) => {
    store.dispatch(startCreating);
    store.dispatch(setItemContent(''));
  }),
  // eslint-disable-next-line no-unused-vars
  editAnswer: Ramda.curry((store, previousState) => {
    store.dispatch(startEditing);
  }),
  // eslint-disable-next-line no-unused-vars
  newQuiz: Ramda.curry((store, previousState) => {
    store.dispatch(setItemContent(''));
    store.dispatch(setItemTitle(''));
  }),
};
