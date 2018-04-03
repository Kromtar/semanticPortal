const jwt = require('jwt-simple');
const moment = require('moment');

const secret = process.env.JWTSECRET;

exports.ensureAuth = function (req, res, next) {
  if (!req.headers.auth) {
    return res.status(403).send({ message: 'Missing Header' });
  }

  const token = req.headers.auth.replace(/["']/g, '');

  try {
    const payload = jwt.decode(token, secret);
    req.user = payload;
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: 'Expired Token' });
    }
  } catch (ex) {
    return res.status(404).send({ message: 'Invalid Token' });
  }

  next();
};
