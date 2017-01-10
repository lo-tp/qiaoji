// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import { PAGE_NUMBER } from 'app-config';

// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';

// eslint-disable-next-line import/no-extraneous-dependencies
import chaiHttp from 'chai-http';
import app from '../server';
import Quiz from '../model/quiz';
import Question from '../model/question';
import { mockData, createUerAndCookie } from '../testTools';
import { dbSetupTest, dbClose } from '../setup/db';

chai.use(chaiHttp);

const path = '/functions/quiz';
const assert = chai.assert;

describe('quiz services', () => {
  let user;
  let cookie;

  before(async () => {
    dbSetupTest();
    const tem = await createUerAndCookie();
    user = tem.user;
    cookie = tem.cookie;
  });
  beforeEach(async () => {
    await Quiz.remove({});
  });
  it('unauthorized user should not be allowed to create new quiz', async () => {
    try {
      await chai.request(app)
      .post(`${path}/new`)
      .send({
        content: 'content',
        title: 'title',
      });
      assert.equal(1, 401);
    } catch (e) {
      assert.equal(e.status, 401);
    }
  });
  it('create new quiz', async () => {
    const res = await chai.request(app)
      .post(`${path}/new`)
      .set('cookieId', cookie._id)
      .send({
        content: 'content',
        title: 'title',
      });
    assert.equal(res.status, 200);
    const count = await Quiz.count({});
    assert.equal(count, 1);
    const newQuiz = await Quiz.findOne({});
    assert.equal(newQuiz.content, 'content');
    assert.equal(newQuiz.title, 'title');
    const newQuestion = await Question.findOne({ quiz: newQuiz._id });
    assert.equal(newQuestion.user, user._id);
  });

  it('unauthorized user should not be allowed to get page count', async () => {
    try {
      await chai.request(app)
      .get(`${path}/pageCount`)
      .send();
      assert.equal(1, 401);
    } catch (e) {
      assert.equal(e.status, 401);
    }
  });

  it('get page count', async () => {
    await Quiz.remove({});
    const fakeData = [];
    for (let index = 0; index < PAGE_NUMBER + 1; index += 1) {
      fakeData.push({
        quiz: {
          content: 'content',
          title: 'title',
          user: user._id,
        },
      });
    }

    for (let index = 0; index < PAGE_NUMBER; index += 1) {
      fakeData.push({
        quiz: {
          content: 'content',
          title: 'title',
          user: 'your user id',
        },
      });
    }

    await mockData(fakeData);

    let res = await chai.request(app)
      .get(`${path}/pageCount`)
      .set('cookieId', cookie._id)
      .send();
    assert.equal(res.status, 200);
    assert.equal(res.body.pageNumber, 3);
    res = await chai.request(app)
      .get(`${path}/pageCount`)
      .set('cookieId', cookie._id)
      .query({
        belong: 1,
      });
    assert.equal(res.status, 200);
    assert.equal(res.body.pageNumber, 2);
  });

  after(done => {
    dbClose();
    done();
  });
});

// page number in req means how many page we want to skip
// while page number in res which page we are at
describe('getPage', () => {
  // eslint-disable-next-line no-unused-vars
  let user;
  let cookie;

  before(async () => {
    dbSetupTest();
    const tem = await createUerAndCookie();
    user = tem.user;
    cookie = tem.cookie;
    const fakeData = [];
    for (let index = 0; index < PAGE_NUMBER + 1; index += 1) {
      fakeData.push({
        quiz: {
          content: `content ${index}`,
          title: `title ${index}`,
          user: 'your id',
        },
      });
    }

    for (let index = 0; index < 2; index += 1) {
      fakeData.push({
        quiz: {
          content: `content ${PAGE_NUMBER + 1 + index}`,
          title: `title ${PAGE_NUMBER + 1 + index}`,
          user: user._id,
        },
        answer: {
          user: user._id,
          content: `answer ${PAGE_NUMBER + 1 + index}`,
        },
      });
    }

    await mockData(fakeData);
  });
  it('return first page when the page number is invalid', async () => {
    const res = await chai.request(app)
    .get(`${path}/page/content`)
    .set('cookieId', cookie._id)
    .query({
      pageNumber: 'abc',
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.pageNumber, 1);
    res.body.quizzes.forEach((q, i) => {
      assert.equal(q.content, `content ${i}`);
      assert.equal(q.title, `title ${i}`);
    });
  });
  it('get first page', async () => {
    const res = await chai.request(app)
    .get(`${path}/page/content`)
    .set('cookieId', cookie._id)
    .query({
      pageNumber: 0,
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.pageNumber, 1);
    assert.equal(res.body.count, PAGE_NUMBER);
    res.body.quizzes.forEach((q, i) => {
      assert.equal(q.content, `content ${i}`);
      assert.equal(q.title, `title ${i}`);
    });
  });

  it('get second page', async () => {
    const res = await chai.request(app)
    .get(`${path}/page/content`)
    .set('cookieId', cookie._id)
    .query({
      pageNumber: 1,
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.pageNumber, 2);
    assert.equal(res.body.count, PAGE_NUMBER);
    assert.equal(res.body.quizzes.length, PAGE_NUMBER);
    assert.equal(res.body.quizzes[0].content, `content ${PAGE_NUMBER}`);
    assert.equal(res.body.quizzes[0].title, `title ${PAGE_NUMBER}`);
    assert.equal(res.body.quizzes[1].content, `content ${PAGE_NUMBER + 1}`);
    assert.equal(res.body.quizzes[1].title, `title ${PAGE_NUMBER + 1}`);
    assert.equal(res.body.quizzes[1].answer.content,
                 `answer ${PAGE_NUMBER + 1}`);
    assert.equal(res.body.quizzes[2].content, `content ${PAGE_NUMBER + 2}`);
    assert.equal(res.body.quizzes[2].title, `title ${PAGE_NUMBER + 2}`);
    assert.equal(res.body.quizzes[2].answer.content,
                 `answer ${PAGE_NUMBER + 2}`);
  });

  it('get first page filtered by user', async () => {
    const res = await chai.request(app)
    .get(`${path}/page/content`)
    .set('cookieId', cookie._id)
    .query({
      pageNumber: 0,
      belong: 1,
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.pageNumber, 1);
    assert.equal(res.body.count, 2);
    assert.equal(res.body.quizzes.length, 2);
    assert.equal(res.body.quizzes[0].content, `content ${PAGE_NUMBER + 1}`);
    assert.equal(res.body.quizzes[0].title, `title ${PAGE_NUMBER + 1}`);
    assert.equal(res.body.quizzes[1].content, `content ${PAGE_NUMBER + 2}`);
    assert.equal(res.body.quizzes[1].title, `title ${PAGE_NUMBER + 2}`);
  });

  after(done => {
    dbClose();
    done();
  });
});
