import './App.css';
import Home from './Home';
import Create from './Create';
import View from './View';
import Edit from './Edit';
import { BrowserRouter, Route, useNavigate } from './Router';
import { useState } from 'react';

const Navigation = () => {
  const navigate = useNavigate();
  const [viewMenu, setViewMenu] = useState(false);
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
              onMouseLeave={() => {
                setViewMenu(false);
              }}
              style={{ height: 55, display: 'flex', alignItems: 'center' }}
            >
              <div style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                Create
              </div>
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
      <div style={{ paddingTop: 16, paddingBottom: 80 }}>
        <Route path='/' component={<Home />} />
        <Route path='/create' component={<Create />} />
        <Route path='/view' component={<View />} />
        <Route path='/edit' component={<Edit />} />
      </div>
    </BrowserRouter>
  );
}

export default App;
