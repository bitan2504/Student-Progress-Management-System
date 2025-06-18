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
import StudentInfo from './pages/StudentInfo.jsx';
import AutoSignin from './components/AutoSignin.jsx';
import { ToastContainer } from 'react-toastify';
import AddStudent from './pages/AddStudent.jsx';
import Settings from './pages/Settings.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <ToastContainer
          position="top-right"
          autoClose="5000"
          hideProgressBar="false"
          closeOnClick="true"
          pauseOnHover="true"
          draggable="true"
        />
        <AutoSignin />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <App />
              </>
            }
          />
          <Route
            path="/table"
            element={
              <>
                <Navbar />
                <Table />
              </>
            }
          />
          <Route
            path="/add"
            element={
              <>
                <Navbar />
                <AddStudent />
              </>
            }
          />
          <Route
            path="/student/:handle"
            element={
              <>
                <Navbar />
                <StudentInfo />
              </>
            }
          />
          <Route path="/settings" element={<Settings />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
