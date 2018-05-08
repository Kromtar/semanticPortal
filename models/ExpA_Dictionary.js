const mongoose = require('mongoose');

const { Schema } = mongoose;

//TODO: ¿El array  de readers hasta cuandos subdocumentos soportara?
//TODO: Se podria subividir esta collection por letras
//TODO: Se podria tener una collection auxiliar
//para almacenar solo las palabras pendientes por preguntar
//TODO: Se podria ocupar un contador en vez de un date para saber

const readerSchema = new Schema({
  testId: { type: Schema.Types.ObjectId, ref: 'exp_a_tests' }, //TODO: Poner guion bajo
  asked: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const dictionarySchema = new Schema({
  word: String,
  readers: [readerSchema] //TODO: Poner guion bajo
});

mongoose.model('exp_a_dictionary', dictionarySchema);
mongoose.model('exp_a_reader', readerSchema);
