import Ramda from 'ramda';
import { setQuestionMeta } from './action';

export default {
  // eslint-disable-next-line no-unused-vars
  normal: Ramda.curry((store, previousState) => {
    store.dispatch(setQuestionMeta({
      goOver: false,
    }));
  }),
  // eslint-disable-next-line no-unused-vars
  goOver: Ramda.curry((store, previousState) => {
    store.dispatch(setQuestionMeta({
      goOver: true,
    }));
  }),
};
