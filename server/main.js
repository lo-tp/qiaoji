import express from 'express';
const app = express();
app.use(express.static('static'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
