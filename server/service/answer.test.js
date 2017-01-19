// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';

// eslint-disable-next-line import/no-extraneous-dependencies
import chaiHttp from 'chai-http';
import app from '../server';
import Quiz from '../model/quiz';
import Answer from '../model/answer';
import Question from '../model/question';
import { dbSetupTest, dbReset } from '../setup/db';
import { mockData, createUerAndCookie } from '../testTools';

chai.use(chaiHttp);

const path = '/functions/answer';
const assert = chai.assert;
let user;
let cookie;

describe('create new answer', () => {
  before(async () => {
    dbSetupTest();
    const tem = await createUerAndCookie();
    user = tem.user;
    cookie = tem.cookie;
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
    dbReset();
    done();
  });
});
describe('Edit existing answer', () => {
  let result;
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
    result = await mockData([
      {
        quiz: {
          content: 'content',
          title: 'title',
          user: user._id,
        },
        answer: {
          content: 'content',
          user: user._id,
        },
      },
    ]);
  });
  it('500 when answerId is invalid', async () => {
    try {
      await chai.request(app)
      .post(`${path}/edit`)
      .set('cookieId', cookie._id)
      .send({
        create: true,
        content: 'sdjfl',
        answerId: 'isdfljsdfj',
      });
    } catch (e) {
      assert.equal(e.status, 500);
    }
  });
  it('refuse to edit when content is not valid', async () => {
    const res = await chai.request(app)
    .post(`${path}/edit`)
    .set('cookieId', cookie._id)
      .send({
        content: '',
        answerId: result[0].answer._id,
      });
    assert.equal(res.body.result, 0);
    assert.equal(res.body.reason, 0);
  });
  it('status 200 when every is ok', async () => {
    const res = await chai.request(app)
    .post(`${path}/edit`)
    .set('cookieId', cookie._id)
      .send({
        content: 'I am doing a test',
        answerId: result[0].answer._id,
      });
    const answer = await Answer.findOne({ _id: result[0].answer._id });
    assert.equal(res.body.result, 1);
    assert.equal(res.body.answerId, result[0].answer._id);
    assert.equal(answer.content, 'I am doing a test');
  });
});
