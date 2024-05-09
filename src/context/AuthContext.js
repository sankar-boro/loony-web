import React, { useContext, useEffect, useState } from 'react';
import { axiosInstance } from '../query';

export const AuthContext = React.createContext(null);
export const useAuth = () => useContext(AuthContext);

const useAuthSession = () => {
  const [auth, setAuth] = useState({
    auth: false,
    user: null,
  });
  useEffect(() => {
    axiosInstance.get('/auth/user/session').then(({ data }) => {
      setAuth({
        auth: true,
        user: data,
      });
    });
  }, []);
  return [auth, setAuth];
};
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useAuthSession();
  const login = (user) => {
    setAuth({
      user,
      auth: true,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
