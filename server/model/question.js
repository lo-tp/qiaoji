import mongoose from 'mongoose';
import { getDaysSinceEpoch } from '../../common/tool';

const questionScheme = mongoose.Schema({
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
  answer: {
    type: String,
    ref: 'Answer',
    required: false,
  },
  dueDate: {
    type: Number,
    default: getDaysSinceEpoch(),
    required: true,
  },
  update: {
    type: Number,
    default: getDaysSinceEpoch(),
    required: true,
  },
  interval: {
    type: Number,
  },
  difficulty: {
    type: Number,
  },
  goOver: {
    type: Boolean,
  },
});

// eslint-disable-next-line import/no-mutable-exports
let Question;
if (mongoose.models.Question) {
  Question = mongoose.model('Question');
} else {
  Question = mongoose.model('Question', questionScheme, 'questions');
}

export default Question;
