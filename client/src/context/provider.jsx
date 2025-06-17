import Context from './context.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Provider = ({ children }) => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const ratingColor = {
    newbie: 'text-gray-500',
    pupil: 'text-green-500',
    specialist: 'text-cyan-600',
    expert: 'text-blue-500',
    'candidate master': 'text-purple-500',
    master: 'text-yellow-500',
    'international master': 'text-orange-500',
    grandmaster: 'text-red-500',
    'international grandmaster': 'text-pink-500',
    'legendary grandmaster': 'text-indigo-500',
    unrated: 'text-black-500',
  };

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        darkMode,
        setDarkMode,
        navigate,
        ratingColor,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
