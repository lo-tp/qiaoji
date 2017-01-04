// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import { DEV } from 'app-config';
import 'babel-polyfill';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import userService from './service/user';
import commonService from './service/common';
import quizRouter from './service/quiz';

const app = express();
app.use(bodyParser.json());
if (DEV) {
  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

app.use(express.static('static'));
app.use('/functions', commonService.checkLoginStatus);
app.use('/functions/quiz', quizRouter);

app.post('/login', userService.login);

app.post('/signup', userService.signUp);
app.post('/renewCookie', userService.renewCookie);

export default app;
