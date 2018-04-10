const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');

//TODO: Agregar campos de usuario
const userSchema = new Schema({
  rut: String,
  password: String,
});

userSchema.methods.generateHash = function (password) {
  //TODO: Revisar ciclo de 8 en bcrypt
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

mongoose.model('users', userSchema);
