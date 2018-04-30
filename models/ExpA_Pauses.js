const mongoose = require('mongoose');
const { Schema } = mongoose;

const expapauseSchema = new Schema({
  timeIn: Date,
  timeOut: Date,
});

mongoose.model('exp_a_pauses', expapauseSchema);
