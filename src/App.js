import Home from './Home';
import BlogView from './blog/View';
import BookView from './book/View';
import EditBlog from './blog/Edit';
import EditBook from './book/Edit';
import Create from './form';
import Profile from './profile';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Alert from './Alert';
import { CREATE_BOOK, CREATE_BLOG } from './url';
import { Routes, Route as ReactRoute, BrowserRouter, Link } from 'react-router-dom';

import { LiaUserSolid } from 'react-icons/lia';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { axiosInstance } from './query';

const Navigation = ({ auth, logout }) => {
  const logoutUser = () => {
    axiosInstance.post('/auth/logout').then(() => {
      logout();
    });
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
                      <Link to='/create/book' state={{}}>
                        Create Book
                      </Link>
                    </li>
                    <li>
                      <Link to='/create/blog' state={{}}>
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
                <div className='profile-content list-items' style={{ marginLeft: -15 }}>
                  <ul>
                    {auth.auth ? (
                      <li>
                        <Link to='#' onClick={logoutUser}>
                          Logout
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <Link to='/login'>Login</Link>
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
          {({ auth, logout, context }) => {
            return (
              <>
                {context.alert && <Alert alert={context.alert} onClose={() => {}} />}
                <Navigation auth={auth} logout={logout} />
                {auth.auth && (
                  <Routes>
                    <ReactRoute path='/' element={<Home />} />
                    <ReactRoute path='/view/book/:bookId' element={<BookView />} />
                    <ReactRoute path='/view/blog/:blogId' element={<BlogView />} />
                    <ReactRoute
                      path='/create/book'
                      element={<Create url={CREATE_BOOK} title='Create Book' />}
                    />
                    <ReactRoute
                      path='/create/blog'
                      element={<Create url={CREATE_BLOG} title='Create Blog' />}
                    />
                    <ReactRoute path='/edit/book/:bookId' element={<EditBook />} />
                    <ReactRoute path='/edit/blog/:blogId' element={<EditBlog />} />
                    <ReactRoute path='/profile' element={<Profile />} />
                    <ReactRoute path='*' element={<div>Route error</div>} />
                  </Routes>
                )}
                {!auth.auth && (
                  <Routes>
                    <ReactRoute path='/' element={<Home />} />
                    <ReactRoute path='/login' element={<Login />} />
                    <ReactRoute path='/signup' element={<Signup />} />
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
