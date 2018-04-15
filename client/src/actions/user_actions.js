import axios from 'axios';
import jwtDecode from 'jwt-decode';

import {
  LOAD_TOKEN,
  FORM_ERR,
  LOAD_USERID
} from './types';

export const loginUser = (credentials) => async (dispatch) => {

  credentials.getToken = true;

  try {
    const res = await axios.post('/api/loginUser', credentials);
    const decodeToken = jwtDecode(res.data.token);
    dispatch({ type: LOAD_TOKEN, payload: res.data.token });
    dispatch({ type: LOAD_USERID, payload: decodeToken.id});
    return true;
  } catch (err) {
    dispatch({ type: FORM_ERR, payload: {formId:'login', err:'Error en el login'}});
    return false;
  }

};

export const createNewUser = (userData) => async (dispatch) => {

  function formatRut(rut){
    var rutTrimed = rut.trim();
    var valor = rutTrimed.replace(/\./g,'');
    valor = valor.replace('-','');
    var cuerpo = valor.slice(0,-1);
    var dv = valor.slice(-1).toUpperCase();
    rutTrimed = cuerpo + '-'+ dv
    return rutTrimed;
  }

  const data = {
    name: userData.name.trim().toLowerCase(),
    surname: userData.surname.trim().toLowerCase(),
    rut: formatRut(userData.newRut),
    mail: userData.mail.trim(),
    age: userData.age.trim(),
    password: userData.newPassword.trim(),
    gender: userData.gender,
    interest: userData.interest
  };

  try {
    const res = await axios.post('/api/createUser', data);
    return true;
  } catch (err) {
    return false;
  }
};
