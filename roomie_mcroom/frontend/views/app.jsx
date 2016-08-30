import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import Home from './pages/home.jsx';
import Login from './pages/login.jsx'; 
import ErrorPage from './pages/error.jsx';

class Test extends React.Component {
  render() {
    return (
      <div className='test'>
        <h1>Hello Test</h1>
      </div>
    );
  }
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={Home}>
    </Route>
    <Route path="/test" component={Test}/>
    <Route path="/login" component={Login}/>
    <Route path="*" component={ErrorPage}/>
  </Router>
), document.getElementById('app'));
