import Home from './Home';
import View from './View';
import EditBlog from './blog/Edit';
import EditBook from './book/Edit';
import Create from './form';
import Profile from './profile';
import Login from './auth/Login';
import Signup from './auth/Signup';
import { Routes, Route as ReactRoute, useNavigate, BrowserRouter, Link } from 'react-router-dom';

import { LiaUserSolid } from 'react-icons/lia';
import { AuthContext, AuthProvider } from './context/AuthContext';

const Navigation = ({ auth }) => {
  // const navigate = useNavigate();
  const navHome = () => {
    // navigate('/', {});
  };
  return (
    <div className='top-navbar' style={{ backgroundColor: 'black' }}>
      <div className='book-container cursor' style={{ height: 55 }}>
        <div className='flex-row' style={{ height: 55 }}>
          <div style={{ flex: 2 }}>
            <div style={{ height: 55, display: 'flex', alignItems: 'center' }}>
              <Link className='nav-item' to='/' style={{ color: 'white' }}>
                LOONY
              </Link>
            </div>
          </div>
          <div style={{ flex: 1, height: 55 }}>
            <div
              className='view-dropdown-menu'
              style={{
                height: 55,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  width: 120,
                }}
                className='create-button'
              >
                <button style={{ fontWeight: 'bold' }}>Create</button>
                <div className='dropdown-content list-items'>
                  <ul>
                    <li>
                      <Link to='create/book' state={{}}>
                        Create Book
                      </Link>
                    </li>
                    <li>
                      <Link to='create/blog' state={{}}>
                        Create Blog
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
                className='profile-button'
              >
                <LiaUserSolid size={32} />
                <div className='profile-content list-items'>
                  <ul>
                    {auth.auth ? (
                      <li>
                        <Link to='logout'>Logout</Link>
                      </li>
                    ) : (
                      <li>
                        <Link to='login'>Login</Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthContext.Consumer>
          {({ auth }) => {
            return (
              <>
                <Navigation auth={auth} />
                {auth.auth && (
                  <Routes>
                    <ReactRoute path='/' element={<Home />} />
                    <ReactRoute path='view' element={<View />} />
                    <ReactRoute
                      path='create/book'
                      element={<Create url='/create/book' title='Create Book' />}
                    />
                    <ReactRoute
                      path='create/blog'
                      element={<Create url='/create/blog' title='Create Blog' />}
                    />
                    <ReactRoute path='edit/book/:bookId' element={<EditBook />} />
                    <ReactRoute path='edit/blog/:bookId' element={<EditBlog />} />
                    <ReactRoute path='profile' element={<Profile />} />
                    <ReactRoute path='*' element={<div>Route error</div>} />
                  </Routes>
                )}
                {!auth.auth && (
                  <Routes>
                    <ReactRoute path='/' element={<Home />} />
                    <ReactRoute path='login' element={<Login />} />
                    <ReactRoute path='signup' element={<Signup />} />
                  </Routes>
                )}
              </>
            );
          }}
        </AuthContext.Consumer>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
