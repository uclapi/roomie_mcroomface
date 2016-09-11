import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import Auth from '../utils/auth.js';

import Home from './pages/home.jsx';
import Login from './pages/login.jsx'; 
import ErrorPage from './pages/error.jsx';
import Calendar from './pages/calendar/calendar.jsx';
import Rooms from './pages/rooms.jsx';

class Test extends React.Component {
  render() {
    return (
      <div className='test'>
        <h1>Hello Test</h1>
      </div>
    );
  }
}

function requireAuth(nextState, replace) {
  if (!Auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={Home}/>
    <Route path="/login" component={Login}/>
    <Route path="/rooms" component={Rooms}/>
    <Route path="/schedule/:roomId" component={Calendar}/>
    <Route path="*" component={ErrorPage}/>
  </Router>
), document.getElementById('app'));
