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

  it('unauthorized user should not be allowed to get quiz list', async () => {
    try {
      await chai.request(app)
      .get(`${path}/list`)
      .send({
        content: 'content',
        title: 'title',
      });
      assert.equal(1, 401);
    } catch (e) {
      assert.equal(e.status, 401);
    }
  });

  // it('get quiz list', async () => {
  // await Quiz.remove({});
  // const res = await chai.request(app)
  // .post(`${path}/list`)
  // .send(dataTemplate);
  // assert.equal(res.status, 200);
  // });

  after(done => {
    dbClose();
    done();
  });
});
