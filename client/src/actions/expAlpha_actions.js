import axios from 'axios';

import {
  EXP_A_LOAD_TEST,
  EXP_A_LOAD_WORD,
  EXP_A_ADD_WORD_LIST,
  EXP_A_LOAD_ROUND,
  EXP_A_CLEAR_WORD_LIST,
  EXP_A_ADD_ROUND_READY,
  EXP_A_ADD_ROUND_WORD_COUNT
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
  try {
    const res = await axios.post('/api/loadNextWord', data, { headers: { authorization: "Bearer " +  token }});
    dispatch({ type: EXP_A_LOAD_WORD, payload: res.data.word });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export const initRound = (data, token) => async (dispatch) => {
  try {
    const res = await axios.post('/api/initRound', data, { headers: { authorization: "Bearer " +  token }});
    dispatch({ type: EXP_A_LOAD_ROUND, payload: res.data });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export const addToWordList = (data) => dispatch => new Promise((resolve, reject) => {
  dispatch({ type: EXP_A_ADD_WORD_LIST, payload: data});
  resolve();
});

export const sendWordList = (data, token) => async (dispatch) => {
  try{
    if(data.wordList.length === 0){
      return true;
    }
    await axios.post('/api/addWordToRelation', data, { headers: { authorization: "Bearer " +  token }});
    dispatch({ type: EXP_A_CLEAR_WORD_LIST, payload: {} });
    return true;
  }catch (err) {
    console.log(err);
    return false;
  }
}

export const endRound = (data, token) => async (dispatch) => {
  try{
    await axios.post('/api/endRound', data, { headers: { authorization: "Bearer " +  token }});
    dispatch({ type: EXP_A_ADD_ROUND_READY, payload: {} });
    return true;
  }catch (err) {
    console.log(err);
    return false;
  }
}

export const addRoundWordCount = () => dispatch => new Promise((resolve, reject) => {
  dispatch({ type: EXP_A_ADD_ROUND_WORD_COUNT, payload: {}});
  resolve();
});

export const sendPauseEvent = (data, token) => async (dispatch) => {
  try{
    await axios.post('/api/addPause', data, { headers: { authorization: "Bearer " +  token }});
    return true;
  }catch (err) {
    console.log(err);
    return false;
  }
}
