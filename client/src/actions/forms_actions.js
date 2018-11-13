import {
  FORM_INPUT,
  FORM_ERR,
  FORM_CLEAR
} from './types';

export const formInput = (data) => dispatch => {
  dispatch({ type: FORM_INPUT, payload: data});
};

export const formError = (data) => dispatch => {
  dispatch({ type: FORM_ERR, payload: data});
};

export const formClear = (data) => dispatch => {
  dispatch({ type: FORM_CLEAR, payload: data});
}
