const UserController = require('../controllers/user');

module.exports = app => {
  app.post(
    '/api/createUser',
    UserController.createUser
  );
};
