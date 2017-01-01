import mongoose from 'mongoose';

const answerScheme = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
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
});

export default mongoose.model('Quiz', answerScheme);
