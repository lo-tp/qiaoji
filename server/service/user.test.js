// eslint-disable-next-line import/no-extraneous-dependencies
import chai from 'chai';
// eslint-disable-next-line import/no-extraneous-dependencies
import chaiHttp from 'chai-http';
import app from '../server';
import Quiz from '../model/quiz';
import { dbSetupTest, dbClose } from '../setup/db';


chai.use(chaiHttp);

const path = '/functions/quiz';
const assert = chai.assert;

describe('user services', () => {
  before(async () => {
    dbSetupTest();
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

  after(done => {
    dbClose();
    done();
  });
});
