import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../utils/query';
import { INIT, UNAUTHORIZED, AUTHORIZED } from 'loony-types';
import PageLoader from '../components/PageLoader';

export const AuthContext = React.createContext(null);

const useAuthSession = () => {
  const [authContext, setAuthContext] = useState({
    status: INIT,
    user: null,
  });

  useEffect(() => {
    axiosInstance
      .get('/auth/user/session')
      .then(({ data }) => {
        setAuthContext({
          user: data,
          status: AUTHORIZED,
        });
      })
      .catch(() => {
        setAuthContext({
          user: null,
          status: UNAUTHORIZED,
        });
      });
  }, []);
  return [authContext, setAuthContext];
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuthContext] = useAuthSession();
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

  if (auth.status === INIT)
    return (
      <div className='book-container'>
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
          <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }} />
          <div
            style={{
              width: '100%',
              paddingTop: 15,
              paddingLeft: '5%',
              background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
              paddingBottom: 50,
            }}
          >
            <PageLoader key_id={1} />
          </div>
        </div>
      </div>
    );

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuthContext,
        context,
        setContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
