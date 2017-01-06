import Ramda from 'ramda';

export default {
  // eslint-disable-next-line no-unused-vars
  list: Ramda.curry((store, previousState) => {
    store.dispatch({
      type: 'GET_QUIZ_PAGE_COUNT',
    });
  }),
};
