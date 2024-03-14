import './App.css';
import Home from './book/Home';
import Create from './book/Create';
import View from './book/View';
import Edit from './book/Edit';
import { BrowserRouter, Route } from './Router';

function App() {
  return (
    <BrowserRouter>
      <Route path='/' component={<Home />} />
      <Route path='/create_book' component={<Create />} />
      <Route path='/view_book' component={<View />} />
      <Route path='/edit_book' component={<Edit />} />
    </BrowserRouter>
  );
}

export default App;
