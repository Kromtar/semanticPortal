import { combineReducers } from 'redux';

import test from './test';
import forms from './forms';
import user from './user';
import application from './application';
import expAlpha from './expAlpha';
import expBeta from './expBeta';

export default combineReducers({
  test: test,
  forms: forms,
  user: user,
  application: application,
  expAlpha: expAlpha,
  expBeta: expBeta
});
