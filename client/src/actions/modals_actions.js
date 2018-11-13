import {
   MODAL_CONTROL
} from './types';

export const modalControl = (data) => dispatch => {
  dispatch({ type: MODAL_CONTROL, payload: data});
};
