import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import Home from './pages/home.jsx';
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
    <Route path="/" component={Home} />
		<Route path="/test" component={Test} />
  </Router>
), document.getElementById('app'));
