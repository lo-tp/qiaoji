import mongoose from 'mongoose';

const answerScheme = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  quiz: {
    type: String,
    ref: 'Quiz',
    required: true,
  },
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model('Quiz', answerScheme);
