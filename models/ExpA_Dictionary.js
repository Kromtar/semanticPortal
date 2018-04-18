const mongoose = require('mongoose');
const { Schema } = mongoose;

//TODO: ¿El array readers hasta cuandos subdocumentos soportara?

const readerSchema = new Schema({
  testId: { type: Schema.Types.ObjectId, ref: 'exp_a_tests' },
  asked: { type: Boolean, default: false},
  date: { type: Date, default: Date.now }
});

const dictionarySchema = new Schema({
  word: String,
  readers:[readerSchema]
});

mongoose.model('exp_a_dictionary', dictionarySchema);
mongoose.model('exp_a_reader', readerSchema);
