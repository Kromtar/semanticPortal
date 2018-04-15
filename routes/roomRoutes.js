const authJwt = require('../middlewares/authJwt');
const RoomController = require('../controllers/room');

module.exports = app => {

  app.post(
    '/api/loadRoom',
    authJwt.ensureAuth,
    RoomController.loadRoom
  );

};
