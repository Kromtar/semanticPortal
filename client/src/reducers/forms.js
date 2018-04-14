  import { FORM_INPUT, FORM_ERR, FORM_CLEAR } from '../actions/types';
import update from 'react-addons-update';


//TODO: Actualizar el modelo para incluir un error por cada input
var defaultValues = {
  login: {
    rut: '',
    password: '',
    err: ''
  },
  newAccount: {
    name: '',
    surname: '',
    newRut: '',
    mail: '',
    age: '',
    newPassword: '',
    newPasswordVer: '',
    gender:'',
    interest: [],
    err: ''
  }
}

export default function(state = defaultValues, action) {
  var newState;
  switch (action.type){
    case FORM_INPUT:
      newState = update(state, {[action.payload.formId]: { [action.payload.inputId]: {$set: action.payload.text}}});
      return newState;
    case FORM_ERR:
      newState = update(state, {[action.payload.formId]: { 'err': {$set: action.payload.err}}});
      return newState;
    case FORM_CLEAR:
      newState = update(state, {[action.payload.formId]: {$set: defaultValues[action.payload.formId]}});
      return newState;
    default:
      return state;
  }
}
