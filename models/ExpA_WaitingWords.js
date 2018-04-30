const mongoose = require('mongoose');
const { Schema } = mongoose;

const waitingwordsSchema = new Schema({
  testId: { type: Schema.Types.ObjectId, ref: 'exp_a_tests' },  //TODO: Poner guion bajo
  waitingwords: [{ type: Schema.Types.ObjectId, ref: 'exp_a_dictionary' }] //TODO: Poner guion bajo
});

mongoose.model('exp_a_waitingwords', waitingwordsSchema);
