import {
  FORM_INPUT,
  FORM_ERR
} from './types';

export const formInput = (data) => dispatch => {
  dispatch({ type: FORM_INPUT, payload: data});
};

export const formError = (data) => dispatch => {
  dispatch({ type: FORM_ERR, payload: data});
};
