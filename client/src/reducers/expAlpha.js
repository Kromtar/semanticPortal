import { EXP_LOAD_ALPHA } from '../actions/types';
import update from 'react-addons-update';

var defaultValues = {
  parameters: {
    instructions: '',
    initialpool: []
  }
}

export default function(state = defaultValues , action) {
  var newState;
  switch (action.type){
    case EXP_LOAD_ALPHA:
      newState = update(state, {parameters: {$set: action.payload.parameters}});
      return newState;
    default:
      return state;
  }
}
