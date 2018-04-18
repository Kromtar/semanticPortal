import axios from 'axios';

import {
  EXP_A_LOAD_TEST
} from './types';

export const loadUserTest = (data, token) => async (dispatch) => {

  try {
    const res = await axios.post('/api/loadUserTest', data, { headers: { authorization: "Bearer " +  token }});
    dispatch({ type: EXP_A_LOAD_TEST, payload: res.data._id });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }

};

export const loadNewWord = (data, token) => async (dispatch) => {
  const res = await axios.post('/api/loadNextWord', data, { headers: { authorization: "Bearer " +  token }});
  //guardar palabra
  console.log(res.data);
}
