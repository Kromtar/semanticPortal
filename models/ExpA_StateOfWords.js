const mongoose = require('mongoose');
const { Schema } = mongoose;

const expastateofwordSchema = new Schema({
  word: { type: String, unique: true },
  asked: { type: Boolean, default: false },
});

mongoose.model('exp_a_stateofwords', expastateofwordSchema);
