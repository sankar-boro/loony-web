import React, { useContext, useState } from 'react';

export const AuthContext = React.createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const login = (user) => {
    setAuth(true);
    setUser(user);
  };
  console.log('called');
  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
