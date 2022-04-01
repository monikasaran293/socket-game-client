import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home'

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/home" element={<Home />} />
      <Route exact path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
