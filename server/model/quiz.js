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

// eslint-disable-next-line import/no-mutable-exports
let Quiz;
if (mongoose.models.Quiz) {
  Quiz = mongoose.model('Quiz');
} else {
  Quiz = mongoose.model('Quiz', quizScheme, 'quizzes');
}

export default Quiz;
