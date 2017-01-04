import mongoose from 'mongoose';

const userScheme = mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  }, // wechat nickname
  password: {
    type: String,
    required: true,
  },
});

// eslint-disable-next-line import/no-mutable-exports
let User;
if (mongoose.models.User) {
  User = mongoose.model('User');
} else {
  User = mongoose.model('User', userScheme, 'users');
}

export default User;
