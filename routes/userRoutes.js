const UserController = require('../controllers/user');
const adminLevel = require('../middlewares/adminLevel');

module.exports = app => {
  app.post(
    '/api/createUser',
    UserController.createUser
  );

  //TODO: Borrar en produccion
  app.post(
    '/api/changePassword',
    adminLevel.auth,
    UserController.changePassword
  );
};
