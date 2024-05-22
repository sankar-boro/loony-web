import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../utils/query';

export const AuthContext = React.createContext(null);

const useAuthSession = () => {
  const [auth, setAuth] = useState({
    auth: false,
    user: null,
    alert: null,
  });
  useEffect(() => {
    axiosInstance
      .get('/auth/user/session')
      .then(({ data }) => {
        setAuth({
          auth: true,
          user: data,
        });
      })
      .catch(() => {});
  }, []);
  return [auth, setAuth];
};
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useAuthSession();
  const [context, setContext] = useState({
    alert: null,
  });
  useEffect(() => {
    if (context.alert) {
      setTimeout(() => {
        setContext({
          ...context,
          alert: null,
        });
      }, 3000);
    }
  }, [context, context.alert]);

  const login = (user) => {
    setAuth({
      user,
      auth: true,
    });
  };

  const logout = (user) => {
    setAuth({
      user: null,
      auth: false,
    });
  };

  const setAuthContext = (key, value) => {
    setContext({
      ...context,
      [key]: value,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        context,
        setAuthContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
