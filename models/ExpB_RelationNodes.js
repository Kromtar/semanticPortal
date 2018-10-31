const mongoose = require('mongoose');

const { Schema } = mongoose;

const expbSequenceSchema = new Schema({
  wordA: String,
  wordB: String,
  conectionType: String,
});

const expbRelationNodeSchema = new Schema({
  testId: { type: Schema.Types.ObjectId, ref: 'exp_b_tests' },
  wordA: String,
  wordB: String,
  sequence: [expbSequenceSchema]
});

mongoose.model('exp_b_relation_nodes', expbRelationNodeSchema);
mongoose.model('exp_b_sequences', expbSequenceSchema);
