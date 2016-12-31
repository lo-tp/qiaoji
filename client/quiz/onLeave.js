import Ramda from 'ramda';

import { setNewPreview, setNewContent, setNewTitle } from './action';

export default {
  // eslint-disable-next-line no-unused-vars
  newPage: Ramda.curry((store, previousState) => {
    store.dispatch(
      setNewTitle('')
    );
    store.dispatch(
      setNewContent('')
    );
    store.dispatch(
      setNewPreview(false)
    );
  }),
};
