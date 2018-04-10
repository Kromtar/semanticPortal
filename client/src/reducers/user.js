import { LOAD_TOKEN } from '../actions/types';
import update from 'react-addons-update';

var defaultValues = {
  token: ''
}

export default function(state = defaultValues , action) {
  var newState;
  switch (action.type){
    case LOAD_TOKEN:
      newState = update(state, {token: {$set: action.payload}});
      return newState;
    default:
      return state;
  }
}
