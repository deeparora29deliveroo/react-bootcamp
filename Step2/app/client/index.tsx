import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './components/App';
import Path from './components/Path'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/path" element={<Path />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<AppRoutes />, document.getElementById('root'));
