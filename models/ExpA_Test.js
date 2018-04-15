const mongoose = require('mongoose');
const { Schema } = mongoose;

const expatestSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'users' },
  active: { type: Boolean, default: true },
  expatestusernumber: { type: Number, default: 1 },
  _stateofwords: { type: Schema.Types.ObjectId, ref: 'exp_a_stateofwords' },
  _rounds: [{ type: Schema.Types.ObjectId, ref: 'exp_a_rounds' }],
  _pauses: { type: Schema.Types.ObjectId, ref: 'exp_a_pauses' },
});

mongoose.model('exp_a_tests', expatestSchema);
