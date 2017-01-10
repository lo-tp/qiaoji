// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import { QUALIFY_DIFFICULTY } from 'app-config';
import express from 'express';

import Question from '../model/question';
import { getDaysSinceEpoch } from '../../common/tool';

const router = express.Router();
router.get('/list', async (req, res) => {
  try {
    const questions = await Question.find({
      user: req.user._id,
    })
    .where('difficulty').gte(QUALIFY_DIFFICULTY)
  // eslint-disable-next-line newline-per-chained-call
    .where('dueDate').lte(getDaysSinceEpoch())
    .populate('answer')
    .populate('quiz');
    const results = [];
    questions.forEach(q => {
      const {
        _id: id,
        dueDate,
        update,
        interval,
        difficulty,
        quiz: {
          content,
          title,
        },
        answer,
      } = q;
      const result = {
        id,
        dueDate,
        update,
        interval,
        difficulty,
        quiz: {
          content,
          title,
        },
      };
      if (answer) {
        result.answer = {
          content: answer.content,
        };
      }

      results.push(result);
    });
    res.json({
      questions: results,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e.message);
    res.status(500);
  }

  res.end();
});

export default router;
