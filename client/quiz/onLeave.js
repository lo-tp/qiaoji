import Ramda from 'ramda';

import { setItemPreview, setItemContent, setItemTitle } from './action';

export default {
  // eslint-disable-next-line no-unused-vars
  newPage: Ramda.curry((store, previousState) => {
    store.dispatch(
      setItemTitle('')
    );
    store.dispatch(
      setItemContent('')
    );
    store.dispatch(
      setItemPreview(false)
    );
  }),
};
