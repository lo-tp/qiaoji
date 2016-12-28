import bcrypt from 'bcrypt';
import User from '../model/user';

const signUp = async (req, res) => {
  let user = await User.findOne({
    userName: req.body.userName,
  });
  if (user === null) {
    user = new User();
    Object.keys(req.body).forEach(k => {
      user[k] = req.body[k];
    });
    try {
      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;
      user.save();
    } catch (e) {
      res.staus(500).json({
        reason: 1,
      });
    }

    res.json(req.body);
  } else {
    res.status(500).json({
      reason: 0,
    });
  }
};

export default {
  signUp,
};
