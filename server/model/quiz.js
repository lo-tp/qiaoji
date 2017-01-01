import mongoose from 'mongoose';

const quizScheme = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
});

export default mongoose.model('Quiz', quizScheme);
