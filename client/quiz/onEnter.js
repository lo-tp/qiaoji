import Ramda from 'ramda';

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
};
