import express from 'express';

const app = express();
app.use(express.static('static'));

app.get('/login', (req, res) => {
  console.info('login');
  res.send('login');
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Example app listening on port 3000!');
});
