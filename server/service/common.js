import Cookie from '../model/cookie';
import User from '../model/user';

const checkLoginStatus = async (req, res, next) => {
  let cookie = null;
  try {
    cookie = await Cookie.findOne({
      _id: req.get('cookieId'),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(e.message);
  }

  if (cookie === null) {
    res.sendStatus(401);
  } else {
    // eslint-disable-next-line no-param-reassign
    req.user = await User.findOne({ _id: cookie.uid });
    next();
  }
};

export default {
  checkLoginStatus,
};
