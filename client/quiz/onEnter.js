import Ramda from 'ramda';
import { setPageAllMeta, setMeta, setPageMineMeta, setItemTitle, setItemContent,
  PAGE_ALL, PAGE_MINE, startCreating, startEditing } from './action';
import validations from '../../common/validations';

export default {
  // eslint-disable-next-line no-unused-vars
  all: Ramda.curry((store, nextState, replace) => {
    let { user, pageNumber } = nextState.params;
    let setPageMeta = setPageAllMeta;
    if (user === 'all') {
      store.dispatch(
        setMeta({
          currentPage: PAGE_ALL,
        }));
    } else if (user === store.getState().app.quiz.meta.mine.get('user')) {
      setPageMeta = setPageMineMeta;
      store.dispatch(
        setMeta({
          currentPage: PAGE_MINE,
        }));
    }

    if (validations.pageNumber({
      errors: {},
      values: { pageNumber: `${pageNumber}` },
    }).errors.pageNumber !== undefined) {
      replace(`/functions/quiz/list/${user}/1`);
    } else {
      pageNumber = parseInt(pageNumber, 10);
      store.dispatch(
        setPageMeta({
          key: 'pageNumber',
          value: pageNumber,
        }));
      store.dispatch({
        type: 'GO_TO_QUIZ_OAGE',
      });
    }
  }),
  // eslint-disable-next-line no-unused-vars
  filteredByUser: Ramda.curry((store, nextState) => {
    // store.dispatch({
    // type: 'GET_QUIZ_PAGE_COUNT',
    // belong: 1,
    // });
  }),
  // eslint-disable-next-line no-unused-vars
  newAnswer: Ramda.curry((store, nextState) => {
    store.dispatch(startCreating);
    store.dispatch(setItemContent(''));
  }),
  // eslint-disable-next-line no-unused-vars
  editAnswer: Ramda.curry((store, nextState) => {
    store.dispatch(startEditing);
  }),
  // eslint-disable-next-line no-unused-vars
  newQuiz: Ramda.curry((store, nextState) => {
    store.dispatch(setItemContent(''));
    store.dispatch(setItemTitle(''));
  }),
};
