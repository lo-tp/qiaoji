import mongoose from 'mongoose';

const questionScheme = mongoose.Schema({
  quiz: {
    type: Number,
    ref: 'Quiz',
    required: true,
  },
  user: {
    type: Number,
    ref: 'User',
    required: true,
  },
  answer: {
    type: Number,
    ref: 'Answer',
    required: false,
  },
  update: {
    type: Number,
  },
  interval: {
    type: Number,
  },
  difficulty: {
    type: Number,
  },
});

export default mongoose.model('Question', questionScheme);
