import Home from './Home';
import View from './View';
import Edit from './Edit';
import Create from './Create';
import Profile from './profile';
import Login from './auth/Login';
import Signup from './auth/Signup';
import { BrowserRouter, Route, useNavigate } from './Router';

import { LiaUserSolid } from 'react-icons/lia';

const Navigation = () => {
  const navigate = useNavigate();
  const navHome = () => {
    navigate('/', {});
  };
  return (
    <div className='top-navbar' style={{ backgroundColor: 'black' }}>
      <div className='book-container cursor' onClick={navHome} style={{ height: 55 }}>
        <div className='flex-row' style={{ height: 55 }}>
          <div style={{ flex: 2 }}>
            <div style={{ height: 55, display: 'flex', alignItems: 'center' }}>
              <a className='nav-item' href='/' style={{ color: 'white' }}>
                LOONY
              </a>
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
                <div className='dropdown-content'>
                  <ul>
                    <li>
                      <a href='/create?name=book'>Create Book</a>
                    </li>
                    <li>
                      <a href='/create?name=blog'>Create Blog</a>
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
                <a href='/login' style={{ color: 'white' }}>
                  <LiaUserSolid size={32} />
                </a>
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
    <BrowserRouter>
      <Navigation />
      <div style={{ paddingBottom: 80, height: '100%' }}>
        <Route path='/' component={<Home />} />
        <Route path='/create' component={<Create />} />
        <Route path='/view' component={<View />} />
        <Route path='/edit' component={<Edit />} />
        <Route path='/profile' component={<Profile />} />
        <Route path='/login' component={<Login />} />
        <Route path='/signup' component={<Signup />} />
      </div>
    </BrowserRouter>
  );
}

export default App;
