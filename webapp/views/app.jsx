import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import Auth from '../utils/auth.js';

import Home from './pages/home/home.jsx';
import Login from './pages/login/login.jsx';
import ErrorPage from './pages/error/error.jsx';
import Calendar from './pages/calendar/calendar.jsx';
import Rooms from './pages/rooms/rooms.jsx';
import ConfirmBooking from './pages/confirmBooking/confirmBooking.jsx';
import Profile from './pages/profile/profile.jsx';
import newLogin from './pages/login/newLogin.jsx';

function requireAuth(nextState, replace) {
  if (!Auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={Home}/>
    <Route path="/login" component={newLogin}/>
    <Route path="/newLogin" component={newLogin}/>
    <Route path="/rooms" component={Rooms} onEnter={requireAuth}/>
    <Route path="/schedule/:roomId" component={Calendar} onEnter={requireAuth}/>
    <Route path="/book/:roomId/:dateTime" component={ConfirmBooking} onEnter={requireAuth}/>
    <Route path="/profile" component={Profile} onEnter={requireAuth}/>
    <Route path="*" component={ErrorPage}/>
  </Router>
), document.getElementById('app'));
