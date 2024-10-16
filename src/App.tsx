import { AuthContext, AuthProvider } from './context/AuthContext.tsx'
import AppContext, { AppProvider } from './context/AppContext.tsx'
import NotificationContext, {
  NotificationProvider,
} from './context/NotificationContext.tsx'

import { BrowserRouter } from 'react-router-dom'
import Route from './routes/index.tsx'
import { AuthContextProps } from 'loony-types'

function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContext.Consumer>
              {(appContext) => {
                return (
                  <NotificationContext.Consumer>
                    {(notificationContext) => {
                      return (
                        <AuthContext.Consumer>
                          {(authContext: AuthContextProps) => {
                            return (
                              <Route
                                authContext={authContext}
                                appContext={appContext}
                                notificationContext={notificationContext}
                              />
                            )
                          }}
                        </AuthContext.Consumer>
                      )
                    }}
                  </NotificationContext.Consumer>
                )
              }}
            </AppContext.Consumer>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </AppProvider>
  )
}

export default App
