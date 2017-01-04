import app from './server';
import { dbSetup } from './setup/db';

dbSetup();


app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Example app listening on port 3000!');
});
