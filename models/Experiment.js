const mongoose = require('mongoose');

const { Schema } = mongoose;

const experimentSchema = new Schema({
  roomNumber: { type: Number, unique: true },
  name: String,
  active: { type: Boolean, default: true },
  parameters: {},
  expPublicId: Number,
});

mongoose.model('experiments', experimentSchema);
