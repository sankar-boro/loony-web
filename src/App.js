import { AuthContext, AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Route from './routes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthContext.Consumer>
          {({ auth, context }) => {
            return <Route auth={auth} context={context} />;
          }}
        </AuthContext.Consumer>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
