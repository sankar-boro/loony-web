import './App.css';
import Home from './Home';
import Create from './Create';
import View from './View';
import { BrowserRouter, Route } from './Router';

function App() {
  return (
    <BrowserRouter>
      <Route path='/' component={<Home />} />
      <Route path='/create_book' component={<Create />} />
      <Route path='/view_book' component={<View />} />
    </BrowserRouter>
  );
}

export default App;
