import Context from './context.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Provider = ({ children }) => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  return (
    <Context.Provider value={{ token, setToken, user, setUser, darkMode, setDarkMode, navigate }}>
      {children}
    </Context.Provider>
  );
};

export default Provider;
