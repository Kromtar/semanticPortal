const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');

const exparelactionSchema = new Schema({
  word: String,
  date: { type: Date, default: Date.now },
});

const exparoundSchema = new Schema({
  word: String,
  finalized: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  relation:[exparelactionSchema]
});

exparelactionSchema.plugin(autoIncrement.plugin, { model: 'exp_a_relactions', field: 'order' });
exparoundSchema.plugin(autoIncrement.plugin, { model: 'exp_a_rounds', field: 'order' });

mongoose.model('exp_a_relactions', exparelactionSchema);
mongoose.model('exp_a_rounds', exparoundSchema);
