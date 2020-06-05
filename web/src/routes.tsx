import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CriarPonto from './pages/CriarPonto';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CriarPonto} path="/criar-ponto" />
    </BrowserRouter>
  )
}

export default Routes;