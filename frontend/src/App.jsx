import React from 'react';
import {BrowserRouter as Router , Routes , Route , Navigate} from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';

const Root =() => {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    isAuthenticated ? (<Navigate to='/dashboard'> </Navigate>) : (<Navigate to='/login'></Navigate>)
  );
}

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Root/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/dashboard' element={<Home/>}/>
          <Route path='/expense' element={<Expense/>}/>
          <Route path='/income' element={<Income/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;