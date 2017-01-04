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

// eslint-disable-next-line import/no-mutable-exports
let Answer;
if (mongoose.models.Answer) {
  Answer = mongoose.model('Answer');
} else {
  Answer = mongoose.model('Answer', answerScheme, 'answer');
}

export default Answer;
