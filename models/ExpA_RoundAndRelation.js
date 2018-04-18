const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');

const exparelationSchema = new Schema({
  word: String,
  date: { type: Date, default: Date.now },
});

const exparoundSchema = new Schema({
  word: String,
  finalized: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  relation:[exparelationSchema]
});

exparelationSchema.plugin(autoIncrement.plugin, { model: 'exp_a_relation', field: 'order' });
exparoundSchema.plugin(autoIncrement.plugin, { model: 'exp_a_rounds', field: 'order' });

mongoose.model('exp_a_relation', exparelationSchema);
mongoose.model('exp_a_rounds', exparoundSchema);
