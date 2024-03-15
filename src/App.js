import './App.css';
import Home from './book/Home';
import Create from './book/Create';
import View from './book/View';
import Edit from './book/Edit';
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
      <Route path='/' component={<Home />} />
      <Route path='/create_book' component={<Create />} />
      <Route path='/view' component={<View />} />
      <Route path='/edit' component={<Edit />} />
    </BrowserRouter>
  );
}

export default App;
