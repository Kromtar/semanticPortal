const authJwt = require('../middlewares/authJwt');
const expBetaController = require('../controllers/expBeta');

module.exports = app => {
  app.post(
    '/api/loadUserTestBeta',
    authJwt.ensureAuth,
    expBetaController.loadUserTestBeta
  );

  app.post(
    '/api/loadExpBetaWords',
    authJwt.ensureAuth,
    expBetaController.loadExpBetaWords
  );

  app.post(
    '/api/saveWordsRelations',
    authJwt.ensureAuth,
    expBetaController.saveWordsRelations
  );

};
