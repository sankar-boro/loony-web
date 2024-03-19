import './App.css';
import Home from './Home';
import Create from './Create';
import View from './View';
import Edit from './Edit';
import { BrowserRouter, Route, useNavigate } from './Router';

const Navigation = () => {
  const navigate = useNavigate();
  const navHome = () => {
    navigate('/', {});
  };
  return (
    <div className='top-navbar'>
      <div className='con-75 cursor' onClick={navHome}>
        <a className='nav-item' href='/'>
          Home
        </a>
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
