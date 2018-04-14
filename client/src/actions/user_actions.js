import axios from 'axios';
import jwtDecode from 'jwt-decode';

import {
  LOAD_TOKEN,
  FORM_ERR
} from './types';

export const loginUser = (credentials) => async (dispatch) => {

  credentials.getToken = true;

  try {
    const res = await axios.post('/api/loginUser', credentials);
    const decodeToken = jwtDecode(res.data.token);
    dispatch({ type: LOAD_TOKEN, payload: res.data.token });
    return true;
  } catch (err) {
    dispatch({ type: FORM_ERR, payload: {formId:'login', err:'Error en el login'}});
    return false;
  }

};
