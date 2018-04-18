import { EXP_LOAD_ALPHA, EXP_A_LOAD_TEST } from '../actions/types';
import update from 'react-addons-update';

var defaultValues = {
  parameters: {
    instructions: ''
  },
  testId: ''
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
    default:
      return state;
  }
}
