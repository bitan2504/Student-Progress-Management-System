import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Navbar from './components/Navbar.jsx';
import Provider from './context/provider.jsx';
import Login from './pages/Login.jsx';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './pages/NotFound.jsx';
import Table from './pages/Table.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<><Navbar /><App /></>} />
          <Route path="/table" element={<><Navbar /><Table /></>} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}

        <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
