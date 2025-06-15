import Context from './context.jsx';
import { useState } from 'react';

const Provider = ({ children }) => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Context.Provider value={{ token, setToken, user, setUser, darkMode, setDarkMode }}>
      {children}
    </Context.Provider>
  );
};

export default Provider;
