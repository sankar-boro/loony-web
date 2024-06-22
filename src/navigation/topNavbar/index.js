import { LuMenu } from 'react-icons/lu';
import { LiaUserSolid } from 'react-icons/lia';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useMemo } from 'react';
import { AUTHORIZED, UNAUTHORIZED } from 'loony-types';
import { AuthContext } from '../../context/AuthContext';
import { axiosInstance } from 'loony-query';

const Navigation = ({ auth, setMobileNavOpen, isMobile }) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const logoutUser = useMemo(() => {
    axiosInstance.post('/auth/logout').then(() => {
      authContext.setAuthContext({
        status: UNAUTHORIZED,
        user: null,
      });
    });
  }, [authContext]);

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
              {auth.status === AUTHORIZED ? (
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
                  <div className='dropdown-content'>
                    <div className='dropdown-content-items'>
                      <div className='list-items'>
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
                  </div>
                </div>
              ) : null}

              {auth.status === AUTHORIZED ? (
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
                  <div className='profile-content'>
                    <div className='profile-content-items'>
                      <div className='list-items'>
                        <ul>
                          <li>
                            <Link to='/profile'>Profile</Link>
                          </li>
                          <li>
                            <Link to='#' onClick={logoutUser}>
                              Logout
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  style={{ fontWeight: 'bold' }}
                  onClick={() => {
                    navigate('/login', { replace: true });
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
