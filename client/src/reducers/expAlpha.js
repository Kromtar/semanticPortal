import {
  EXP_LOAD_ALPHA,
  EXP_A_LOAD_TEST,
  EXP_A_LOAD_WORD,
  EXP_A_ADD_WORD_LIST,
  EXP_A_LOAD_ROUND,
  EXP_A_CLEAR_WORD_LIST,
  EXP_A_ADD_ROUND_READY
} from '../actions/types';
import update from 'react-addons-update';

var defaultValues = {
  parameters: {
    instructions: ''
  },
  testId: '',
  wordId: '',
  actualWord: '',
  wordInputList: [],
  roundsComplete: 0,
  roundId: ''
}

export default function(state = defaultValues , action) {
  var newState;
  switch (action.type){
    case EXP_LOAD_ALPHA:
      newState = update(state, {parameters: {$set: action.payload.parameters}});
      return newState;
    case EXP_A_LOAD_TEST:
      newState = update(state, {testId: {$set: action.payload }});
      return newState;
    case EXP_A_LOAD_WORD:
      newState = update(state, {actualWord: {$set: action.payload.word}, wordId: {$set: action.payload._id} });
      return newState;
    case EXP_A_ADD_WORD_LIST:
      newState = update(state, {wordInputList: {$push: [action.payload] }});
      return newState;
    case EXP_A_LOAD_ROUND:
      newState = update(state, {roundId: {$set: action.payload }});
      return newState;
    case EXP_A_CLEAR_WORD_LIST:
      newState = update(state, {wordInputList: {$set: [] }});
      return newState;
    case EXP_A_ADD_ROUND_READY:
      newState = update(state, {roundsComplete: {$set: state.roundsComplete + 1 }});
      return newState;
    default:
      return state;
  }
}
