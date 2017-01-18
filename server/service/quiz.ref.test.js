// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import { PAGE_NUMBER } from 'app-config';

// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';

// eslint-disable-next-line import/no-extraneous-dependencies
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '../server';
import Quiz from '../model/quiz';
import Question from '../model/question';
import { mockData, createUerAndCookie } from '../testTools';
import { dbSetupTest, dbClose } from '../setup/db';

chai.use(chaiHttp);

const path = '/functions/quiz';
const assert = chai.assert;

describe('page/count/:userId', () => {
  let user;
  let cookie;
  let index;
  const minePageCount = 2;
  const mineQuizzes = [];
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
      mineQuizzes.push({ quiz: { ...fakeQuiz, user: user._id } });
    }

    allQuizzes.push({ quiz: { ...fakeQuiz, user: user._id } });
    mineQuizzes.push({ quiz: { ...fakeQuiz, user: user._id } });
    await mockData(allQuizzes);
  });
  it('invalid userId', async () => {
    try {
      await chai.request(app)
        .get(`${path}/page/count/sdfk`)
        .set('cookieId', cookie._id);
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
    dbClose();
    done();
  });
});
