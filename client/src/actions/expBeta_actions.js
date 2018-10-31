import axios from 'axios';

import {
  EXP_B_LOAD_TEST,
  EXP_B_EXTREMES_WORDS,
} from './types';

//La data que tengo que enviar es el token, la id del experimento de donde quiero que venga la data (ej 1111)
export const loadUserTestBeta = (data, token) => async (dispatch) => {
  try {
    const res = await axios.post('/api/loadUserTestBeta', data, { headers: { authorization: "Bearer " +  token }});
    dispatch({ type: EXP_B_LOAD_TEST, payload: { testId: res.data._id } });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

//Carga las palabras para preguntar
export const loadExpBetaWords = (data, token) => async (dispatch) => {
  try {
    const res = await axios.post('/api/loadExpBetaWords', data, { headers: { authorization: "Bearer " +  token }});
    dispatch({ type: EXP_B_EXTREMES_WORDS, payload: { extremesWords: res.data } });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export const sendRelationWords = (data, token) => async (dispatch) => {
  try {
    await axios.post('/api/saveWordsRelations', data, { headers: { authorization: "Bearer " +  token }});
    const res = await axios.post(
      '/api/loadExpBetaWords',
      {
        alphaExpSource: data.alphaExpSource,
        roomBetaNumber: data.roomBetaNumber
      },
      {headers: { authorization: "Bearer " +  token }}
     );
    dispatch({ type: EXP_B_EXTREMES_WORDS, payload: { extremesWords: res.data } });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
