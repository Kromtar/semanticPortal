const mongoose = require('mongoose');
const { Schema } = mongoose;

const expapauseSchema = new Schema({
  timeIn: { type: Date, default: Date.now },
  timeOut: Date,
});

mongoose.model('exp_a_pauses', expapauseSchema);
