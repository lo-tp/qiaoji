import { getCpsItem } from './localStorage';

// eslint-disable-next-line import/prefer-default-export
export const getCid = () => getCpsItem('cookieId');

export const getQueryString = query => (
  Object.keys(query)
   .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
   .join('&')
   .replace(/%20/g, '+')
);
