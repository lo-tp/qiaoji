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

export default mongoose.model('User', userScheme, 'users');
