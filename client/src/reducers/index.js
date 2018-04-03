import { combineReducers } from 'redux';

import test from './test';
import forms from './forms';
import user from './user';

export default combineReducers({
  test: test,
  forms: forms,
  user: user
});
