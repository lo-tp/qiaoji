import Ramda from 'ramda';
import { getCpsItem } from './common/utilities/localStorage';
import { setTem, showClosableSnackBarMsg } from './action';

export default {
  // eslint-disable-next-line no-unused-vars
  functions: Ramda.curry((store, nextState, replace) => {
    const cookieId = getCpsItem('cookieId');
    if (cookieId) {
      store.dispatch({ type: 'RENEW_COOKIE', cookieId });
      store.dispatch(setTem({ cookieId }));
  // eslint-disable-next-line no-console
      console.info('helo');
    } else {
      store.dispatch(showClosableSnackBarMsg({
        msg: 'failure.unauthorized',
      }));
      replace({
        pathname: '/account',
      });
    }
  }),
};
