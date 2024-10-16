import { AuthContext, AuthProvider, AuthContextProps } from './context/AuthContext.tsx';
import AppContext, { AppProvider } from './context/AppContext.tsx';

import { BrowserRouter } from 'react-router-dom';
import Route from './routes/index.tsx';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContext.Consumer>
            {(appContext) => {
              return <AuthContext.Consumer>
              {(authContext: AuthContextProps) => {
                return <Route authContext={authContext} appContext={appContext} />;
              }}
            </AuthContext.Consumer>
            }}
          </AppContext.Consumer>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;