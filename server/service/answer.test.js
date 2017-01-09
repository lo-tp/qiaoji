// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';

// eslint-disable-next-line import/no-extraneous-dependencies
import chaiHttp from 'chai-http';
import app from '../server';
import Quiz from '../model/quiz';
import Answer from '../model/answer';
import Question from '../model/question';
import { dbSetupTest, dbClose } from '../setup/db';
import { mockData, createUerAndCookie } from '../testTools';

chai.use(chaiHttp);

const path = '/functions/answer';
const assert = chai.assert;

describe('create new answer', () => {
  let user;
  let cookie;

  before(async () => {
    dbSetupTest();
    const tem = await createUerAndCookie();
    user = tem.user;
    cookie = tem.cookie;
  });
  before(async () => {
    dbSetupTest();
  });
  beforeEach(async () => {
    await Quiz.remove({});
    await Answer.remove({});
    await Question.remove({});
    await mockData([
      {
        quiz: {
          content: 'content',
          title: 'title',
          user: user._id,
        },
      },
    ]);
  });

  it('no creation when quizId is not valid', async () => {
    const quiz = new Quiz({
      content: 'content',
      title: 'title',
      user: user._id,
    });
    try {
      await quiz.save();
      await chai.request(app)
      .put(`${path}/new`)
      .set('cookieId', cookie._id)
    .send({
      content: 'sdjfl',
      quizId: '{quiz._id}',
    });
    } catch (e) {
      assert.equal(e.status, 500);
    }
  });

  it('no creation when content is not valid', async () => {
    const quiz = new Quiz({
      content: 'content',
      title: 'title',
      user: user._id,
    });
    await quiz.save();
    const res = await chai.request(app)
    .put(`${path}/new`)
    .set('cookieId', cookie._id)
    .send({
      content: '',
      quizId: quiz._id,
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.reason, 0);
    assert.equal(res.body.result, 0);
  });

  it('no duplication: each user can only have one answer for each quiz', async () => {
    const quiz = new Quiz({
      content: 'content',
      title: 'title',
      user: user._id,
    });
    await quiz.save();
    const answer = new Answer({
      content: 'hello',
      quiz: quiz._id,
      user: user._id,
    });
    await answer.save();
    const res = await chai.request(app)
    .put(`${path}/new`)
    .set('cookieId', cookie._id)
    .send({
      content: 'hello man',
      quizId: quiz._id,
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.result, 0);
    assert.equal(res.body.reason, 1);
  });

  it('the user only wants to answer the quiz', async () => {
    const quiz = new Quiz({
      content: 'content',
      title: 'title',
      user: user._id,
    });
    await quiz.save();
    const res = await chai.request(app)
    .put(`${path}/new`)
    .set('cookieId', cookie._id)
    .send({
      content: 'hello man',
      quizId: quiz._id,
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.result, 1);
    const q = await Question.findOne({
      user: user._id,
      quiz: quiz._id,
      answer: res.body.answerId,
    });
    assert.equal(q, null);
  });

  it('the user wants to not only answer the quiz, but remember the quiz', async () => {
    const result = await mockData([{
      quiz: {
        content: 'content',
        title: 'title',
        user: user._id,
      },
      question: {
        dueDate: 0,
        update: 0,
        interval: 0,
        difficulty: 0,
        user: user._id,
      },
    }]);
    const res = await chai.request(app)
    .put(`${path}/new`)
    .set('cookieId', cookie._id)
    .send({
      content: 'hello man',
      quizId: result[0].quiz._id,
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.result, 1);
    const q = await Question.findOne({
      user: user._id,
      quiz: result[0].quiz._id,
      answer: res.body.answerId,
    });
    assert.notEqual(q, null);
    assert.equal(q.answer, res.body.answerId);
    assert.equal(q.quiz, result[0].quiz._id);
  });

  after(done => {
    dbClose();
    done();
  });
});
