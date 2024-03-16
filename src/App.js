import './App.css';
import Home from './blog/Home';
import Create from './blog/Create';
import View from './blog/View';
import Edit from './blog/Edit';
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
        <Route path='/create_blog' component={<Create />} />
        <Route path='/view' component={<View />} />
        <Route path='/edit' component={<Edit />} />
      </div>
    </BrowserRouter>
  );
}

export default App;
