import {
  EXP_LOAD_ALPHA,
  EXP_A_LOAD_TEST,
  EXP_A_LOAD_WORD,
  EXP_A_ADD_WORD_LIST,
  EXP_A_LOAD_ROUND,
  EXP_A_CLEAR_WORD_LIST,
  EXP_A_ADD_ROUND_READY,
  EXP_A_ADD_ROUND_WORD_COUNT,
  USER_LOG_OUT
} from '../actions/types';
import update from 'react-addons-update';

var defaultValues = {
  parameters: {           //Parametros del experimento
    instructions: ''
  },
  testId: '',             //id del test
  wordId: '',             //id de la palabra raiz de la ronda
  actualWord: '',         //palabra raiz de la ronda
  wordInputList: [],      //cache de palabras de una ronda (Se envia y vacia si llega a 10)
  roundsComplete: 0,      //contador de rondas completadas
  roundId: '',            //id de la ronda
  wordOfRoundCount: 0     //contador de palabras de la ronda actual
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
      newState = update(state, {roundsComplete: {$set: state.roundsComplete + 1 }, wordOfRoundCount: {$set:0} });
      return newState;
    case EXP_A_ADD_ROUND_WORD_COUNT:
      newState = update(state, {wordOfRoundCount: {$set: state.wordOfRoundCount + 1 }});
      return newState;
    case USER_LOG_OUT:
      newState = update(state, {$set: defaultValues});
      return newState;
    default:
      return state;
  }
}
