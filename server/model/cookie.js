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

export default mongoose.model('Cookie', cookieScheme);
