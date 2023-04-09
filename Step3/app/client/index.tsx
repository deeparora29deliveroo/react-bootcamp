import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider} from 'react-redux';
import store from './store';

import App from './components/App';
import Path from './components/Path';

function AppRoutes() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/path" element={<Path />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

ReactDOM.render(<AppRoutes />, document.getElementById('root'));
