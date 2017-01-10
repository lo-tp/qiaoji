import express from 'express';

import Answer from '../model/answer';
import Quiz from '../model/quiz';
import Question from '../model/question';
import validations from '../../common/validations';

const router = express.Router();
router.put('/new', async (req, res) => {
  try {
    const errors = validations.content(
      { errors: {}, values: req.body }).errors;
    const { content, quizId } = req.body;
    const quiz = await Quiz.findOne({ _id: quizId });
    if (errors.content || quiz === null) {
      res.json({
        result: 0,
        reason: 0,
      });
    } else {
      const previousAnswer = await Answer.findOne({
        quiz: quizId,
        user: req.user._id,
      });
      if (previousAnswer !== null) {
        res.json({
          result: 0,
          reason: 1,
        });
      } else {
        const answer = new Answer({
          content,
          quiz: quiz._id,
          user: req.user._id,
        });
        await answer.save();
        const question = await Question.findOne({
          user: req.user._id,
          quiz: quizId,
        });
        if (question !== null) {
          question.answer = answer._id;
          await question.save();
        }

        res.json({
          result: 1,
          answerId: answer._id,
        });
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e.message);
    res.status(500);
  } finally {
    res.end();
  }
});
router.post('/edit', async (req, res) => {
  try {
    const errors = validations.content(
      { errors: {}, values: req.body }).errors;
    const { content, answerId } = req.body;
    const answer = await Answer.findOne({ _id: answerId });
    if (errors.content || answer === null) {
      res.json({
        result: 0,
        reason: 0,
      });
    } else {
      answer.content = content;
      await answer.save();
      res.json({
        result: 1,
        answerId,
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e.message);
    res.status(500);
  } finally {
    res.end();
  }
});

export default router;
