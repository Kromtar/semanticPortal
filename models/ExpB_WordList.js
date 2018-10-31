const mongoose = require('mongoose');

const { Schema } = mongoose;

const wordAssociatesSchema = new Schema({
  word: String,
  asked: { type: Boolean, default: false },
});

const wordlistSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'users' },
  _alphaExpSource: { type: Schema.Types.ObjectId, ref: 'experiments' },
  roomBetaNumber: Number,
  wordsAssociates: [wordAssociatesSchema]
});

mongoose.model('exp_b_words_list', wordlistSchema);
mongoose.model('exp_b_word_associates',wordAssociatesSchema);
