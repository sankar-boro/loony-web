import React, { useEffect, useState } from 'react'
import { axiosInstance } from 'loony-api'
import { AuthStatus } from 'loony-types'
import PageLoader from '../components/PageLoader.tsx'
import { Auth, AuthContextProps } from 'loony-types'

const authState: Auth = {
  status: AuthStatus.IDLE,
  user: null,
}

export const AuthContext = React.createContext<AuthContextProps>({
  ...authState,
  setAuthContext: () => {
    return
  },
})

const useAuthSession = (): [
  Auth,
  React.Dispatch<React.SetStateAction<Auth>>
] => {
  const [authContext, setAuthContext] = useState(authState)

  useEffect(() => {
    axiosInstance
      .get('/auth/user/session')
      .then(({ data }) => {
        setAuthContext({
          user: data,
          status: AuthStatus.AUTHORIZED,
        })
      })
      .catch((err) => {
        console.log(err)
        setAuthContext({
          user: null,
          status: AuthStatus.UNAUTHORIZED,
        })
      })
  }, [])
  return [authContext, setAuthContext]
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authContext, setAuthContext] = useAuthSession()

  if (authContext.status === AuthStatus.IDLE)
    return (
      <div className="book-container">
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
          <div
            style={{
              width: '20%',
              paddingTop: 15,
              borderRight: '1px solid #ebebeb',
            }}
          />
          <div
            style={{
              width: '100%',
              paddingTop: 15,
              paddingLeft: '5%',
              paddingBottom: 50,
            }}
          >
            <PageLoader key_id={1} />
          </div>
        </div>
      </div>
    )

  return (
    <AuthContext.Provider
      value={{
        ...authContext,
        setAuthContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
