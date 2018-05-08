const jwt = require('jwt-simple');
const moment = require('moment');

exports.createToken = function (user) {
  const { rut, _id: id, name } = user;
  const payload = {
    rut,
    id,
    name,
    iat: moment().unix(),
    exp: moment().add(10, 'days').unix()
  };

  return jwt.encode(payload, process.env.JWTSECRET);
};
