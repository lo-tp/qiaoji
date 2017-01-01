import express from 'express';

import Cookie from '../model/cookie';
import User from '../model/user';

const router = express.Router();
router.post('/new', async (req, res) => {
  console.info('hello');
  res.end();
});

export default router;
