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
    <div className='top-navbar'>
      <div className='con-75 cursor' onClick={navHome}>
        <div className='flex-row'>
          <div style={{ flex: 2 }}>
            <a className='nav-item' href='/'>
              Home
            </a>
          </div>
          <div style={{ flex: 1 }}>
            <div
              onMouseOver={() => {
                setViewMenu(true);
              }}
            >
              Create
            </div>
            {viewMenu ? (
              <div
                className='top-menu-dropdown'
                onMouseLeave={() => {
                  setViewMenu(false);
                }}
              >
                <ul>
                  <li>
                    <a href='/create?name=book'>Create Book</a>
                  </li>
                  <li>
                    <a href='/create?name=blog'>Create Blog</a>
                  </li>
                </ul>
              </div>
            ) : null}
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
      <div style={{ paddingTop: 16 }}>
        <Route path='/' component={<Home />} />
        <Route path='/create' component={<Create />} />
        <Route path='/view' component={<View />} />
        <Route path='/edit' component={<Edit />} />
      </div>
    </BrowserRouter>
  );
}

export default App;
