import { LOAD_TOKEN, MODAL_CONTROL } from '../actions/types';
import update from 'react-addons-update';

var defaultValues = {
  userLogIn: false,
  modals:{
    newAccount: false,
  }
}

export default function(state = defaultValues , action) {
  var newState;
  switch (action.type){
    case LOAD_TOKEN:
      newState = update(state, {userLogIn: {$set: true}});
      return newState;
    case MODAL_CONTROL:
      newState = update(state, {modals: { [action.payload.modalId]: {$set: action.payload.state}}});
      return newState;
    default:
      return state;
  }
}
