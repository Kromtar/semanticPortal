import axios from 'axios';

import {
   EXP_LOAD,
   EXP_LOAD_ALPHA
} from './types';

export const roomSelect = (data, token) => async dispatch => {
  try {
    const res = await axios.post('/api/loadRoom', data, { headers: { authorization: "Bearer " +  token }});
    dispatch({ type: EXP_LOAD, payload: res.data});
    if(res.data.expPublicId === 1){
      dispatch({ type: EXP_LOAD_ALPHA, payload: res.data});
      return true;
    }else{
      console.log('Es un tipo de experimento que aun no tiene interfaz de usuario');
      return false;
    }
  } catch (err) {
    return false;
  }
};
