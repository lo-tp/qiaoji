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
import { dbSetupTest, dbClose, dbReset } from '../setup/db';

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

  after(done => {
    dbReset();
    done();
  });
});

describe('page/count/:userId', () => {
  let user;
  let cookie;
  let index;
  const minePageCount = 2;
  const mineQuizzesFirstPage = [];
  const allQuizzes = [];
  const allPagecount = 3;

  before(async () => {
    dbSetupTest();
    const tem = await createUerAndCookie();
    user = tem.user;
    cookie = tem.cookie;
    const fakeQuiz = {
      content: 'content',
      title: 'title',
    };
    for (index = 0; index < PAGE_NUMBER; index += 1) {
      allQuizzes.push({ quiz: { ...fakeQuiz, user: 'kkkk' } });
      allQuizzes.push({ quiz: { ...fakeQuiz, user: user._id } });
      mineQuizzesFirstPage.push({ quiz: { ...fakeQuiz, user: user._id } });
    }

    allQuizzes.push({ quiz: { ...fakeQuiz, user: user._id } });
    mineQuizzesFirstPage.push({ quiz: { ...fakeQuiz, user: user._id } });
    await mockData(allQuizzes);
  });
  it('invalid userId', async () => {
    try {
      await chai.request(app)
        .get(`${path}/page/count/sdfk`)
        .set('cookieId', cookie._id);
      assert.equal(1, 500);
    } catch (e) {
      assert.equal(e.status, 500);
    }
  });

  it('for a specific user', async () => {
    const res = await chai.request(app)
    .get(`${path}/page/count/${user._id}`)
    .set('cookieId', cookie._id);
    assert.equal(res.status, 200);
    assert.equal(res.body.count, minePageCount);
  });

  it('for all user', async () => {
    const res = await chai.request(app)
    .get(`${path}/page/count/all`)
    .set('cookieId', cookie._id);
    assert.equal(res.status, 200);
    assert.equal(res.body.count, allPagecount);
  });

  after(done => {
    dbReset();
    done();
  });
});

describe('page/content/:userId/:pageNumber', () => {
  let user;
  let cookie;
  let index;
  const expectedMineQuizzesFirstPage = [];
  const expectedMineQuizzesSecondPage = [];
  const expectedAllQuizzesFirstTwoPage = [];
  const expectedAllQuizzesLastPage = [];
  let expectedAllQuizzesFirstPage;
  const allQuizzes = [];

  before(async () => {
    dbSetupTest();
    const tem = await createUerAndCookie();
    user = tem.user;
    cookie = tem.cookie;
    const fakeQuiz = {
      content: 'content',
      title: 'title',
    };
    for (index = 0; index < PAGE_NUMBER; index += 1) {
      allQuizzes.push({ quiz: { ...fakeQuiz, content: `${index}kkk`, user: 'kkkk' } });
      allQuizzes.push(
        { quiz: { ...fakeQuiz, content: `${index}`, user: user._id } });
      expectedAllQuizzesFirstTwoPage.push({ ...fakeQuiz, content: `${index}kkk`, user: 'kkkk' });
      expectedAllQuizzesFirstTwoPage.push(
        { ...fakeQuiz, content: `${index}`, user: `${user._id}` });
      expectedMineQuizzesFirstPage.push(
        { ...fakeQuiz, content: `${index}`, user: `${user._id}` });
    }

    allQuizzes.push({ quiz: { ...fakeQuiz, content: 'kk', user: `${user._id}` } });
    expectedMineQuizzesSecondPage.push({ ...fakeQuiz, content: 'kk', user: `${user._id}` });
    expectedAllQuizzesLastPage.push({ ...fakeQuiz, content: 'kk', user: `${user._id}` });
    expectedAllQuizzesFirstPage = expectedAllQuizzesFirstTwoPage.slice(0, 20);
    await mockData(allQuizzes);
  });

  after(done => {
    dbClose();
    done();
  });
  it('invalid userId', async () => {
    try {
      await chai.request(app)
        .get(`${path}/page/content/sdfk/1231`)
        .set('cookieId', cookie._id);
    } catch (e) {
      assert.equal(e.status, 500);
    }
  });
  it('return first page if provide an invalid pageNumber', async () => {
    // for a single user
    let res = await chai.request(app)
    .get(`${path}/page/content/${user._id}/kkk`)
    .set('cookieId', cookie._id);
    let retQuizzes = res.body.quizzes.map(q => {
      // eslint-disable-next-line no-shadow
      const { user, content, title } = q;
      return { user, content, title };
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.count, PAGE_NUMBER);
    assert.deepEqual(retQuizzes, expectedMineQuizzesFirstPage);
    assert.equal(res.body.pageNumber, 1);
    // for all
    res = await chai.request(app)
    .get(`${path}/page/content/all/kkk`)
    .set('cookieId', cookie._id);
    retQuizzes = res.body.quizzes.map(q => {
      // eslint-disable-next-line no-shadow
      const { user, content, title } = q;
      return { user, content, title };
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.count, PAGE_NUMBER);
    assert.deepEqual(retQuizzes, expectedAllQuizzesFirstPage);
    assert.equal(res.body.pageNumber, 1);
  });
  it('get pages for a specific user', async () => {
    // get first page
    let res = await chai.request(app)
    .get(`${path}/page/content/${user._id}/1`)
    .set('cookieId', cookie._id);
    let retQuizzes = res.body.quizzes.map(q => {
      // eslint-disable-next-line no-shadow
      const { user, content, title } = q;
      return { user, content, title };
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.count, PAGE_NUMBER);
    assert.deepEqual(retQuizzes, expectedMineQuizzesFirstPage);
    assert.equal(res.body.pageNumber, 1);
    // get second page
    res = await chai.request(app)
    .get(`${path}/page/content/${user._id}/2`)
    .set('cookieId', cookie._id);
    retQuizzes = res.body.quizzes.map(q => {
      // eslint-disable-next-line no-shadow
      const { user, content, title } = q;
      return { user, content, title };
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.count, 1);
    assert.deepEqual(retQuizzes, expectedMineQuizzesSecondPage);
    assert.equal(res.body.pageNumber, 2);
  });
  it('get pages for all', async () => {
    // get first page
    let res = await chai.request(app)
    .get(`${path}/page/content/all/1`)
    .set('cookieId', cookie._id);
    let retQuizzes = res.body.quizzes.map(q => {
      // eslint-disable-next-line no-shadow
      const { user, content, title } = q;
      return { user, content, title };
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.count, PAGE_NUMBER);
    assert.deepEqual(retQuizzes, expectedAllQuizzesFirstPage);
    assert.equal(res.body.pageNumber, 1);
    // get second page
    res = await chai.request(app)
    .get(`${path}/page/content/all/3`)
    .set('cookieId', cookie._id);
    retQuizzes = res.body.quizzes.map(q => {
      // eslint-disable-next-line no-shadow
      const { user, content, title } = q;
      return { user, content, title };
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.count, 1);
    assert.deepEqual(retQuizzes, expectedAllQuizzesLastPage);
    assert.equal(res.body.pageNumber, 3);
  });
});
