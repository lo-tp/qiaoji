// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import { DEV, HOT_LOAD_URL } from 'config';
import 'babel-polyfill';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';
import userService from './service/user';

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27000');
const db = mongoose.connection;

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => {
  // eslint-disable-next-line no-console
  console.info('connected');
});

const app = express();
app.use(bodyParser.json());
if (DEV) {
  const corsOptions = {
    origin: HOT_LOAD_URL,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

app.use(cookieSession({
  secret: 'hello man',
  secure: false,
}));
app.use(express.static('static'));

app.get('/tem', userService.login);
app.post('/login', userService.login);

app.post('/signup', userService.signUp);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Example app listening on port 3000!');
});
