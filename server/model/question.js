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
});

export default mongoose.model('Question', questionScheme);
