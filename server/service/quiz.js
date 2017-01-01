import express from 'express';

import Quiz from '../model/quiz';
import Question from '../model/question';
import { quizValidation } from '../../common/validations';

const initialRecord = {
  difficulty: 0.3,
  interval: 1,
};
const router = express.Router();
router.post('/new', async (req, res) => {
  const { content, title } = quizValidation(
    { errors: {}, values: req.body }).errors;

  if (content || title) {
    res.status(500);
  } else {
    let quiz;
    let question;
    try {
      quiz = await new Quiz({
        content: req.body.content,
        title: req.body.title,
      });
      await quiz.save();
      question = new Question({
        ...initialRecord,
        quiz: quiz._id,
        user: req.user._id,
      });
      await question.save();
      console.info("hello");
    } catch (e) {
    // eslint-disable-next-line no-console
      console.info(e.message);
      await Quiz.find({ _id: quiz.id }).remove();
      await Question.find({ _id: question.id }).remove();
      res.status(500);
    }
  }

  res.end();
});

export default router;
