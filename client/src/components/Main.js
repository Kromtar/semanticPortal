import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './Login';
import Portal from './Portal';
import AlphaExpMain from './expAlpha/ExpMain';

const Main = () => {
  return(
    <BrowserRouter>
      <div>
        <Route exact={true} path="/" component={Login} />
        <Route exact={true} path="/portal" component={Portal} />
        <Route exact={true} path="/portal/alpha" component={AlphaExpMain} />
      </div>
    </BrowserRouter>
  );
};

export default Main;
