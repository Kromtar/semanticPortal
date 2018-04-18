const authJwt = require('../middlewares/authJwt');
const expAlphaController = require('../controllers/expAlpha');

module.exports = app => {

  app.post(
    '/api/loadUserTest',
    authJwt.ensureAuth,
    expAlphaController.loadUserTest
  );

  app.post(
    '/api/loadNextWord',
    authJwt.ensureAuth,
    expAlphaController.loadNextWord
  );

};
