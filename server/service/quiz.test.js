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
import User from '../model/user';
import Cookie from '../model/cookie';
import { dbSetupTest, dbClose } from '../setup/db';

chai.use(chaiHttp);

const path = '/functions/quiz';
let dataTemplate;
const assert = chai.assert;

const createUerAndCookie = async () => {
  const user = new User();
  user.password = '12341234u';
  user.firstName = 'first';
  user.lastName = 'last';
  user.userName = 'username';
  await user.save();
  const cookie = new Cookie();
  cookie.expireAt = new Date();
  cookie.uid = user._id;
  await cookie.save();
  return { cookie, user };
};

describe('quiz services', () => {
  let user;
  let cookie;

  before(async () => {
    dbSetupTest();
    const tem = await createUerAndCookie();
    user = tem.user;
    cookie = tem.cookie;
    dataTemplate = {
      cookieId: cookie._id,
    };
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
      .send({
        content: 'content',
        title: 'title',
        cookieId: cookie._id,
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
    for (let index = 0; index < PAGE_NUMBER + 1; index += 1) {
      const q = new Quiz();
      q.content = 'content';
      q.title = 'title';
      await q.save();
    }

    const res = await chai.request(app)
      .get(`${path}/pageCount`)
      .send(dataTemplate);
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
    dataTemplate = {
      cookieId: cookie._id,
    };
    for (let index = 0; index < PAGE_NUMBER + 1; index += 1) {
      const q = new Quiz();
      q.content = `content ${index}`;
      q.title = `title ${index}`;
      await q.save();
    }
  });
  it('return first page when the page number is invalid', async () => {
    const res = await chai.request(app)
    .get(`${path}/page/content`)
    .send({
      ...dataTemplate,
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
    .send({
      ...dataTemplate,
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
    .send({
      ...dataTemplate,
      pageNumber: 1,
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.pageNumber, 2);
    assert.equal(res.body.count, 1);
    assert.equal(res.body.quizzes.length, 1);
    assert.equal(res.body.quizzes[0].content, `content ${PAGE_NUMBER}`);
    assert.equal(res.body.quizzes[0].title, `title ${PAGE_NUMBER}`);
  });

  after(done => {
    dbClose();
    done();
  });
});
