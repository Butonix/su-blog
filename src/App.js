import React,{useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import {Board, About, Login, Home, Poster, Signup} from './pages';
import storage from './lib/storage';
import {login_info_save} from './actions/authentication';
import {useDispatch} from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const userInfo = async() => {
    const loginInfo = storage.get('loginInfo');
    await dispatch(login_info_save(loginInfo));
  }
useEffect(() => {
  userInfo();
},[]);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Login}/>
          <Route path="/home/:nick" component={Home}/>
          <Route path="/home" exact component={Home}/>
          <Route path="/about" component={About}/>
          <Route path="/poster/:id/:author" component={Poster} />
          <Route path="/Postting" component={Board} />
          <Route path="/Signup" exact component={Signup}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
