import Context from './context.jsx';
import { useState } from 'react';

const Provider = ({ children }) => {
  const [token, setToken] = useState('');

  return (
    <Context.Provider value={{ token, setToken }}>{children}</Context.Provider>
  );
};

export default Provider;
