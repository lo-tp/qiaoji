import Ramda from 'ramda';
import { getCpsItem } from './common/utilities/localStorage';
import { showCloableSnackBarMsg } from './action';

export default {
  // eslint-disable-next-line no-unused-vars
  functions: Ramda.curry((store, nextState, replace) => {
    const cookieId = getCpsItem('cookieId');
    if (cookieId) {
      console.info('login');
    } else {
      store.dispatch(showCloableSnackBarMsg({
        msg: 'failure.unauthorized',
      }));
    }
  }),
};
