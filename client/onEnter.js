import Ramda from 'ramda';
import { getCpsItem } from './common/utilities/localStorage';
import { setTem, showClosableSnackBarMsg } from './action';
import { setPageMineMeta } from './quiz/action';

export default {
  // eslint-disable-next-line no-unused-vars
  functions: Ramda.curry((store, nextState, replace) => {
    const cookieId = getCpsItem('cookieId');
    const user = getCpsItem('user');
    if (cookieId) {
      store.dispatch({ type: 'RENEW_COOKIE', cookieId });
      store.dispatch(setTem({ cookieId }));
      store.dispatch(setPageMineMeta({ key: 'user', value: user }));
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
