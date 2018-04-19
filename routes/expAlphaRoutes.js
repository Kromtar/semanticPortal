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

  app.post(
    '/api/initRound',
    authJwt.ensureAuth,
    expAlphaController.initRound
  );

  app.post(
    '/api/addWordToRelation',
    authJwt.ensureAuth,
    expAlphaController.addWordToRelation
  );

  app.post(
    '/api/endRound',
    authJwt.ensureAuth,
    expAlphaController.endRound
  );

};
