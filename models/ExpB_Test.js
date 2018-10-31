const mongoose = require('mongoose');

const { Schema } = mongoose;

const expbtestSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'users' },
  _experimentBetaId: { type: Schema.Types.ObjectId, ref: 'experiments' },
  active: { type: Boolean, default: true },
});

mongoose.model('exp_b_tests', expbtestSchema);
