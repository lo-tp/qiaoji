import express from 'express';

import Cookie from '../model/cookie';
import User from '../model/user';

const router = express.Router();
router.post('/new', async (req, res) => {
  res.end();
});

export default router;
