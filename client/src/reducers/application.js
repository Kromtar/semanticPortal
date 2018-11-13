import { LOAD_TOKEN, MODAL_CONTROL, EXP_LOAD, USER_LOG_OUT } from '../actions/types';
import update from 'react-addons-update';

var defaultValues = {
  userLogIn: false,
  activeExpId: '',
  expPublicId: 0,
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
    case EXP_LOAD:
      newState = update(state, {activeExpId: {$set: action.payload._id}, expPublicId: {$set: action.payload.expPublicId}});
      return newState;
    case USER_LOG_OUT:
      newState = update(state, {$set: defaultValues});
      return newState;
    default:
      return state;
  }
}
