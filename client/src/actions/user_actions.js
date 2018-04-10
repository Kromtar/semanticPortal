import axios from 'axios';
import jwtDecode from 'jwt-decode';

import {
  LOAD_TOKEN,
  FORM_ERR
} from './types';

//TODO: Implementado sin cookies

export const loginUser = (credentials) => async (dispatch) => {
  console.log(credentials);

  credentials.getToken = true;

  try {
    const res = await axios.post('/api/loginUser', credentials);

    const decodeToken = jwtDecode(res.data.token);

    console.log(decodeToken);
    dispatch({ type: LOAD_TOKEN, payload: res.data.token });
  } catch (err) {
    dispatch({ type: FORM_ERR, payload: {formId:'login', err:'Error en el login'}});
    console.log(err);
  }

};
