const jwt = require('jwt-simple');
const moment = require('moment');

const secret = process.env.JWTSECRET;

exports.ensureAuth = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'Missing Header' });
  }

  let token = req.headers.authorization.split(' ')[1];
  token = token.replace(/["']/g, '');

  try {
    const payload = jwt.decode(token, secret);
    req.user = payload; //TODO: Se puede ocupar res.locals
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: 'Expired Token' });
    }
  } catch (ex) {
    return res.status(404).send({ message: 'Invalid Token' });
  }

  next();
};
