import { use, useEffect } from 'react';
import { useContext } from 'react';
import Context from '../context/context.jsx';
import axios from 'axios';

export default function AutoSignin() {
  const { user, setUser, token, setToken } = useContext(Context);

  const autoSignin = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/auto`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        setToken(accessToken);
        setUser(true);
      } else {
        console.log(error);
        setUser(false);
      }
    } catch (error) {
      console.log(error);
      setUser(false);
    }
  };

  useEffect(() => {
    console.log(token, user);
    if (token === '' && user === undefined) autoSignin();
  }, [token, user]);

  return <></>;
}
