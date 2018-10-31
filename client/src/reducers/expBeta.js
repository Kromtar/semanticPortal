import {
  EXP_LOAD_BETA,
  EXP_B_LOAD_TEST,
  EXP_B_EXTREMES_WORDS,
} from '../actions/types';
import _ from 'lodash';
import update from 'react-addons-update';

var defaultValues = {
  parameters: {                 //Parametros del experimento
    alphaExpIdSource: ''        //id del experimento alpha de donde vienen los datos
  },
  testId: '',                   //id del test
  extremesWords: [],   //palabras extremas que se tiene que unir
}

export default function(state = defaultValues , action) {
  var newState;
  switch (action.type){
    case EXP_LOAD_BETA:
      newState = update(state, {parameters: {$set: action.payload.parameters}});
      return newState;
    case EXP_B_LOAD_TEST:
      newState = update(state, {testId: {$set: action.payload.testId } });
      return newState;
    case EXP_B_EXTREMES_WORDS:
      newState = update(state, {extremesWords: {$set: action.payload.extremesWords} });
      return newState;
    default:
      return state;
    }
}
