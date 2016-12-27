// eslint-disable-next-line max-len
// eslint-disable-next-line import/no-unresolved, import/extensions,import/no-extraneous-dependencies
import { DEV, HOT_LOAD_URL } from 'config';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
if (DEV) {
  const corsOptions = {
    origin: HOT_LOAD_URL,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

app.use(express.static('static'));

app.post('/login', (req, res) => {
  res.json(req.body);
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Example app listening on port 3000!');
});
