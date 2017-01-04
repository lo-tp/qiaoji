import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import Quiz from '../model/quiz';
import Question from '../model/question';
import User from '../model/user';
import Cookie from '../model/cookie';
import { dbSetupTest, dbClose, dbReset } from '../setup/db';

chai.use(chaiHttp);

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

describe('initialization', () => {
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
      .post('/functions/quiz/new')
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
    .post('/functions/quiz/new')
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

  after(done => {
    dbClose();
    done();
  });
});
