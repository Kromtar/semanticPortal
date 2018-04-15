const mongoose = require('mongoose');
const jwt = require('../services/jwt');

const User = mongoose.model('users');

//Crea un nuevo usuario
//TODO: Es necesario validar toda la informacion (en caso de no bloquear la IP de la API)
async function createUser(req, res) {
  const params = req.body;
  try {
    const user = new User({
      rut: params.rut,
      name: params.name,
      surname: params.surname,
      age: params.age,
      gender: params.gender,
      mail: params.mail,
      interest: params.interest,
      password: params.password
    });
    user.password = user.generateHash(params.password);
    const newUser = await user.save();
    res.status(200).send(newUser);
  } catch(err){
    res.status(404).send(err);
  }
}

//Login de usuario
async function loginUser(req, res) {

  const params = req.body;
  const rut = params.rut;
  const password = params.password;
  const getToken = params.getToken;

  try {
    const userLogin = await User.findOne({rut});
    if(userLogin){
      if(userLogin.validPassword(password)){
        if(getToken){
          res.status(200).send({
            token: jwt.createToken(userLogin)
          });
        }else{
          res.status(200).send({});
        }
      }else{
        res.status(401).send(err);
      }
    }else{
      res.status(401).send(err);
    }
  } catch(err){
    res.status(404).send(err);
  }
}

module.exports = {
  createUser,
  loginUser
};
