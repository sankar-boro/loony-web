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
import { axiosInstance } from './query';
import { CREATE_BOOK, CREATE_BLOG } from './url';
import { AuthContext, AuthProvider } from './context/AuthContext';

import { LuMenu } from 'react-icons/lu';
import { LiaUserSolid } from 'react-icons/lia';
import { Routes, Route as ReactRoute, BrowserRouter, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navigation = ({ auth, logout, setMobileNavOpen, isMobile }) => {
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
              {isMobile ? (
                <LuMenu
                  color='white'
                  size={32}
                  style={{ paddingLeft: 10, paddingRight: 10 }}
                  onClick={() => {
                    setMobileNavOpen((prevState) => !prevState);
                  }}
                />
              ) : null}
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
                justifyContent: 'flex-end',
              }}
            >
              {auth.auth ? (
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
                  <div
                    className='dropdown-content list-items'
                    style={{
                      right: isMobile ? 10 : null,
                    }}
                  >
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
              ) : null}

              <div
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: 20,
                }}
                className='profile-button'
              >
                <LiaUserSolid size={32} />
                <div
                  className='profile-content list-items'
                  style={{
                    marginLeft: -15,
                    right: isMobile ? 10 : null,
                  }}
                >
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (window.innerWidth <= 720) {
      setIsMobile(true);
    }
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthContext.Consumer>
          {({ auth, logout, context }) => {
            return (
              <>
                {context.alert && <Alert alert={context.alert} onClose={() => {}} />}
                <Navigation
                  auth={auth}
                  logout={logout}
                  setMobileNavOpen={setMobileNavOpen}
                  isMobile={isMobile}
                />
                {auth.auth && (
                  <Routes>
                    <ReactRoute path='/' element={<Home isMobile={isMobile} />} />
                    <ReactRoute
                      path='/view/book/:bookId'
                      element={
                        <BookView
                          setMobileNavOpen={setMobileNavOpen}
                          mobileNavOpen={mobileNavOpen}
                          isMobile={isMobile}
                        />
                      }
                    />
                    <ReactRoute
                      path='/view/blog/:blogId'
                      element={<BlogView isMobile={isMobile} />}
                    />
                    <ReactRoute
                      path='/create/book'
                      element={<Create url={CREATE_BOOK} title='Create Book' isMobile={isMobile} />}
                    />
                    <ReactRoute
                      path='/create/blog'
                      element={<Create url={CREATE_BLOG} title='Create Blog' isMobile={isMobile} />}
                    />
                    <ReactRoute
                      path='/edit/book/:bookId'
                      element={
                        <EditBook
                          setMobileNavOpen={setMobileNavOpen}
                          mobileNavOpen={mobileNavOpen}
                          isMobile={isMobile}
                        />
                      }
                    />
                    <ReactRoute
                      path='/edit/blog/:blogId'
                      element={<EditBlog isMobile={isMobile} />}
                    />
                    <ReactRoute path='/profile' element={<Profile isMobile={isMobile} />} />
                    <ReactRoute path='*' element={<div>Route error</div>} />
                  </Routes>
                )}
                {!auth.auth && (
                  <Routes>
                    <ReactRoute path='/' element={<Home isMobile={isMobile} />} />
                    <ReactRoute path='/login' element={<Login isMobile={isMobile} />} />
                    <ReactRoute path='/signup' element={<Signup isMobile={isMobile} />} />
                    <ReactRoute
                      path='/view/book/:bookId'
                      element={
                        <BookView
                          setMobileNavOpen={setMobileNavOpen}
                          mobileNavOpen={mobileNavOpen}
                          isMobile={isMobile}
                        />
                      }
                    />
                    <ReactRoute
                      path='/view/blog/:blogId'
                      element={<BlogView isMobile={isMobile} />}
                    />
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
