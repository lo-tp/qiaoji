// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import { PAGE_NUMBER } from 'app-config';
import express from 'express';
import mongoose from 'mongoose';

import Answer from '../model/answer';
import Quiz from '../model/quiz';
import Question from '../model/question';
import validations, { quizValidation } from '../../common/validations';

const initialRecord = {
  difficulty: 0.4,
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
        user: req.user._id,
      });
      await quiz.save();
      question = new Question({
        ...initialRecord,
        quiz: quiz._id,
        user: req.user._id,
        goOver: true,
      });
      await question.save();
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

router.get('/pageCount', async (req, res) => {
  try {
    const filter = {};
    if (req.query.belong !== undefined && req.query.belong === '1') {
      filter.user = req.user._id;
    }

    const totalNumber = await Quiz.count(filter);
    let count = Math.round(totalNumber / PAGE_NUMBER - 0.5);
    if (count % PAGE_NUMBER) {
      count += 1;
    }

    res.json({
      count,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e.message);
    res.status(500);
  }

  res.end();
});

router.get('/page/content', async (req, res) => {
  try {
    const filter = {};
    if (req.query.belong !== undefined && req.query.belong === '1') {
      filter.user = req.user._id;
    }

    // pageNumber is how many pages we want to skip
    let pageNumber = req.query.pageNumber;
    if (validations.pageNumber({
      errors: {},
      values: { pageNumber: `${pageNumber}` },
    }).errors.pageNumber !== undefined) {
      pageNumber = 0;
    } else {
      pageNumber = parseInt(pageNumber, 10);
    }

    const quizzes = await Quiz.find(filter)
        .skip(pageNumber * PAGE_NUMBER).limit(PAGE_NUMBER);
    const quizIds = quizzes.map(quiz => quiz._id);
    const answers = await Answer.find({ user: req.user._id })
      .where('quiz').in(quizIds);
    answers.forEach(a => {
      // eslint-disable-next-line eqeqeq
      const quiz = quizzes.find(q => q._id == a.quiz);
      // eslint-disable-next-line no-underscore-dangle
      quiz._doc.answer = a;
    });
    res.json({
      quizzes,
      count: quizzes.length,
      pageNumber: pageNumber + 1,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e.message);
    res.status(500);
  }

  res.end();
});

router.get('/page/count/:userId', async (req, res) => {
  try {
    const filter = {};
    const { userId } = req.params;
    if (userId !== 'all') {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        filter.user = userId;
      } else {
        throw new Error('invalid user id');
      }
    }

    const totalNumber = await Quiz.count(filter);
    let count = Math.round(totalNumber / PAGE_NUMBER - 0.5);
    if (totalNumber % PAGE_NUMBER) {
      count += 1;
    }

    res.json({
      count,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e.message);
    res.status(500);
  } finally {
    res.end();
  }
});

router.get('/page/content/:userId/:pageNumber', async (req, res) => {
  try {
    const filter = {};
    const fields = { user: 1, _id: 1, content: 1, title: 1 };
    let { pageNumber } = req.params;
    const { userId } = req.params;
    if (userId !== 'all') {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        filter.user = userId;
      } else {
        throw new Error('invalid user id');
      }
    }

    if (validations.pageNumber({
      errors: {},
      values: { pageNumber: `${pageNumber}` },
    }).errors.pageNumber !== undefined) {
      pageNumber = 1;
    } else {
      pageNumber = parseInt(pageNumber, 10);
    }

    const skipPage = pageNumber - 1;
    let quizzes = await Quiz.find(filter, fields)
        .skip(skipPage * PAGE_NUMBER).limit(PAGE_NUMBER);
    quizzes = quizzes.map(q => {
      const { _id, user, content, title } = q;
      return {
        _id: `${_id}`,
        user: `${user}`,
        content,
        title,
      };
    });
    const quizIds = quizzes.map(quiz => quiz._id);
    const answers = await Answer.find({ user: req.user._id })
      .where('quiz').in(quizIds);
    answers.forEach(a => {
      // eslint-disable-next-line eqeqeq
      const quiz = quizzes.find(q => q._id == a.quiz);
      // eslint-disable-next-line no-underscore-dangle
      quiz.answer = a;
    });
    res.json({
      quizzes,
      count: quizzes.length,
      pageNumber,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message);
    res.status(500);
  } finally {
    res.end();
  }
});

export default router;
