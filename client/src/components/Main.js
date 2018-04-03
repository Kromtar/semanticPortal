import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './Login';
import Portal from './Portal';

const Main = () => {
  return(
    <BrowserRouter>
      <div>
        <Route exact={true} path="/" component={Login} />
        <Route exact={true} path="/portal" component={Portal} />
      </div>
    </BrowserRouter>
  );
};

export default Main;
