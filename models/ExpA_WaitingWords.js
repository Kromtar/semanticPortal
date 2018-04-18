const mongoose = require('mongoose');
const { Schema } = mongoose;

const waitingwordsSchema = new Schema({
  testId: { type: Schema.Types.ObjectId, ref: 'exp_a_tests' },
  waitingwords: [{ type: Schema.Types.ObjectId, ref: 'exp_a_dictionary' }]
});

mongoose.model('exp_a_waitingwords', waitingwordsSchema);
