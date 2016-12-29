import Ramda from 'ramda';
import bcrypt from 'bcrypt';
import validations from '../../common/validations';
import User from '../model/user';
import Cookie from '../model/cookie';

const loginInfoValidate = values => {
  const errors = Ramda.compose(validations.password,
                validations.userName)({ errors: {}, values }).errors;
  return Object.keys(errors).length === 0;
};

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

const login = async (req, res) => {
  let cookie;
  if (!loginInfoValidate(req.body)) {
    // eslint-disable-next-line no-console
    console.error('invalid login info');

    // eslint-disable-next-line no-param-reassign
    req.session = null;
    res.sendStatus(500);
  }

  const user = await User.findOne({
    userName: req.body.userName,
  });

  if (user === null ||
      await bcrypt.compare(req.body.password, user.password) === false) {
    res.status(500);
  } else {
    try {
      cookie = new Cookie();
      cookie.expireAt = new Date();
      cookie.uid = user._id;
      cookie.save();

      // eslint-disable-next-line no-param-reassign
      req.session.id = cookie._id;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      res.status(500).json({
        reason: 0,
      });
    }
  }

  res.end();
};

export default {
  login,
  signUp,
};
