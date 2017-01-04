import mongoose from 'mongoose';

import { cookieExpiration } from '../../common/constant';

const cookieScheme = mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  expireAt: {
    required: true,
    type: Date,
  },
});

cookieScheme.index(
  {
    expireAt: 1,
  },
  {
    expires: cookieExpiration,
  });

// eslint-disable-next-line import/no-mutable-exports
let Cookie;
if (mongoose.models.Cookie) {
  Cookie = mongoose.model('Cookie');
} else {
  Cookie = mongoose.model('Cookie', cookieScheme, 'cookies');
}

export default Cookie;
