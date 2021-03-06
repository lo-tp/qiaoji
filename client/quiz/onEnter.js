import Ramda from 'ramda';
import { setPageAllMeta, setItemPreview, setMeta, setPageMineMeta, setItemTitle,
  setItemContent, PAGE_ALL, PAGE_MINE, startCreating, startEditing } from './action';
import validations from '../../common/validations';

export default {
  // eslint-disable-next-line no-unused-vars
  checkQuizzes: Ramda.curry((store, nextState, replace) => {
  // eslint-disable-next-line prefer-const
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
  newAnswer: Ramda.curry((store, nextState) => {
    store.dispatch(startCreating);
    store.dispatch(setItemContent(''));
    store.dispatch(setItemPreview(false));
  }),
  // eslint-disable-next-line no-unused-vars
  editAnswer: Ramda.curry((store, nextState) => {
    store.dispatch(startEditing);
    store.dispatch(setItemPreview(false));
  }),
  // eslint-disable-next-line no-unused-vars
  newQuiz: Ramda.curry((store, nextState) => {
    store.dispatch(setItemContent(''));
    store.dispatch(setItemTitle(''));
    store.dispatch(setItemPreview(false));
  }),
};
