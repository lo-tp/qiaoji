// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import { QUALIFY_DIFFICULTY } from 'app-config';

// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';

// eslint-disable-next-line import/no-extraneous-dependencies
import chaiHttp from 'chai-http';
import app from '../server';
import Question from '../model/question';
import { dbSetupTest, dbClose } from '../setup/db';
import { mockData, createUerAndCookie } from '../testTools';
import { getDaysSinceEpoch } from '../../common/tool';

chai.use(chaiHttp);

const path = '/functions/question';
const assert = chai.assert;
let user;
let cookie;

describe('get questions for a specific user', () => {
  let expectedForGoOver;
  before(async () => {
    dbSetupTest();
    const tem = await createUerAndCookie();
    user = tem.user;
    cookie = tem.cookie;
  });
  it('status 200', async () => {
    const data = [];
    const expected = [];

    // questions below should be included in the res
    for (let index = 0; index < 3; index += 1) {
      expected.push({
        quiz: {
          content: `content ${index}`,
          title: `title ${index}`,
        },
        answer: {
          content: `content ${index}`,
        },
        dueDate: getDaysSinceEpoch(),
        update: 0,
        interval: 0,
        difficulty: QUALIFY_DIFFICULTY + 0.1,
        goOver: false,
      });
      data.push({
        quiz: {
          content: `content ${index}`,
          title: `title ${index}`,
          user: user._id,
        },
        answer: {
          content: `content ${index}`,
          user: user._id,
        },
        question: {
          goOver: false,
          dueDate: getDaysSinceEpoch(),
          update: 0,
          interval: 0,
          difficulty: QUALIFY_DIFFICULTY + 0.1,
          user: user._id,
        },
      });
    }

    expected.push({
      quiz: {
        content: 'content 1',
        title: 'title 1',
      },
      dueDate: getDaysSinceEpoch(),
      update: 0,
      interval: 0,
      difficulty: QUALIFY_DIFFICULTY + 0.1,
      goOver: false,
    });
    data.push({
      quiz: {
        content: 'content 1',
        title: 'title 1',
        user: user._id,
      },
      question: {
        goOver: false,
        dueDate: getDaysSinceEpoch(),
        update: 0,
        interval: 0,
        difficulty: QUALIFY_DIFFICULTY + 0.1,
        user: user._id,
      },
    });

    // questions below should not be included in the res
    data.push({
      quiz: {
        content: 'content 2',
        title: 'title 2',
        user: user._id,
      },
      question: {
        // this is the reason for the exclusion
        dueDate: getDaysSinceEpoch() + 1,
        update: 0,
        interval: 0,
        difficulty: QUALIFY_DIFFICULTY + 0.1,
        goOver: true,
        user: user._id,
      },
    });

    data.push({
      quiz: {
        content: 'content 2',
        title: 'title 2',
        user: user._id,
      },
      question: {
        dueDate: getDaysSinceEpoch(),
        goOver: false,
        update: 0,
        interval: 0,

        // this is the reason for the exclusion
        difficulty: QUALIFY_DIFFICULTY - 0.01,
        user: user._id,
      },
    });

    data.push(
      {
        quiz: {
          content: 'content test',
          title: 'title test',

          // this is the reason for the exclusion
          user: 'sdjf',
        },
        answer: {
          content: 'content test',
          user: 'sdjf',
        },
        question: {
          dueDate: getDaysSinceEpoch(),
          goOver: false,
          update: 0,
          interval: 0,
          difficulty: QUALIFY_DIFFICULTY + 0.1,
          user: 'sdjf',
        },
      });
    const results = await mockData(data);
    results.slice(0, 4).forEach((r, i) => {
      expected[i].id = `${r.question._id}`;
    });
    expectedForGoOver = [{
      quiz: {
        content: 'content 2',
        title: 'title 2',
      },
      dueDate: getDaysSinceEpoch() + 1,
      update: 0,
      interval: 0,
      difficulty: QUALIFY_DIFFICULTY + 0.1,
      goOver: true,
    }];
    expectedForGoOver[0].id = `${results[4].question._id}`;
    const res = await chai.request(app)
    .get(`${path}/list`)
    .set('cookieId', cookie._id);
    const { questions } = res.body;
    assert.equal(res.status, 200);
    assert.deepEqual(expected, questions);
  });
  it('status 200: get go over', async () => {
    const res = await chai.request(app)
    .get(`${path}/list`)
    .set('cookieId', cookie._id)
    .query({
      goOver: 1,
    });
    const { questions } = res.body;
    assert.equal(res.status, 200);
    assert.deepEqual(expectedForGoOver, questions);
  });
  after(done => {
    dbClose();
    done();
  });
});
describe('update questions', () => {
  const data = [];
  let results;
  before(async () => {
    dbSetupTest();
    const tem = await createUerAndCookie();
    user = tem.user;
    cookie = tem.cookie;

    // questions below are allowed to be updated
    for (let index = 0; index < 3; index += 1) {
      data.push({
        quiz: {
          content: `content ${index}`,
          title: `title ${index}`,
          user: user._id,
        },
        answer: {
          content: `content ${index}`,
          user: user._id,
        },
        question: {
          goOver: true,
          dueDate: getDaysSinceEpoch(),
          update: 0,
          interval: 0,
          difficulty: QUALIFY_DIFFICULTY + 0.1,
          user: user._id,
        },
      });
    }

    // these questions are not allowed to be updated
    data.push(
      {
        quiz: {
          content: 'content test',
          title: 'title test',

          // this is the reason for the exclusion
          user: 'sdjf',
        },
        answer: {
          content: 'content test',
          user: 'sdjf',
        },
        question: {
          dueDate: getDaysSinceEpoch(),
          update: 0,
          interval: 0,
          difficulty: QUALIFY_DIFFICULTY + 0.1,
          user: 'sdjf',
        },
      });
    results = await mockData(data);
  });
  it('500 when update questions not belonging to the user', async() => {
    await assert.equal(1, 1);
    const updateTargets = results.map(r => {
      const ret = {};
      ret.id = `${r.question._id}`;
      ret.dueDate = 12346789;
      return ret;
    });
    try {
      await chai.request(app)
      .post(`${path}/update`)
      .set('cookieId', cookie._id)
      .send({
        questions: updateTargets,
      });
      assert.equal(1, 500);
    } catch (e) {
      assert.equal(e.status, 500);
    }
  });
  it('status 200 when every is ok', async() => {
    assert.equal(1, 1);
    const updateTargets = results.filter(r => r.question.user === `${user._id}`)
      .map(r => {
        const ret = {};
        ret.id = `${r.question._id}`;
        ret.dueDate = 12346789;
        ret.difficulty = 0.8;
        ret.interval = 165;
        ret.update = 399;
        ret.goOver = false;
        return ret;
      });
    const res = await chai.request(app)
    .post(`${path}/update`)
    .set('cookieId', cookie._id)
      .send({
        questions: updateTargets,
      });
    assert.equal(res.status, 200);
    const ids = updateTargets.map(q => q.id);
    const questions = await Question.find({ user: user._id })
    .where('_id').in(ids);
    questions.forEach(q => {
      assert.equal(q.dueDate, 12346789);
      assert.equal(q.difficulty, 0.8);
      assert.equal(q.interval, 165);
      assert.equal(q.update, 399);
      assert.equal(q.goOver, false);
    });
  });
});
