const authJwt = require('../middlewares/authJwt');
const UserController = require('../controllers/user');

module.exports = app => {
  //Rutas de test
  app.get('/api/testOpen', (req, res) => res.send('Hola UAI :), este lugar NO necesita token'));
  app.get('/api/testClose', authJwt.ensureAuth, (req, res) => {
    res.send('Hola UAI :), este ligar SI necesita token');
  });

  app.post(
   '/api/loginUser',
   UserController.loginUser
 );
 
};
