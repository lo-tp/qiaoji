// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import { QUALIFY_DIFFICULTY } from 'app-config';

// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';

// eslint-disable-next-line import/no-extraneous-dependencies
import chaiHttp from 'chai-http';
import app from '../server';
import { dbSetupTest, dbClose } from '../setup/db';
import { mockData, createUerAndCookie } from '../testTools';
import { getDaysSinceEpoch } from '../../common/tool';

chai.use(chaiHttp);

const path = '/functions/question';
const assert = chai.assert;
let user;
let cookie;

describe('get questions for a specific user', () => {
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
    });
    data.push({
      quiz: {
        content: 'content 1',
        title: 'title 1',
        user: user._id,
      },
      question: {
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
    const res = await chai.request(app)
    .get(`${path}/list`)
    .set('cookieId', cookie._id);
    const { questions } = res.body;
    assert.equal(res.status, 200);
    assert.deepEqual(expected, questions);
  });
  after(done => {
    dbClose();
    done();
  });
});
