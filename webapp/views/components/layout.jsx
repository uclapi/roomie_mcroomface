import React from 'react';
import {Link, withRouter} from 'react-router';
import Sidebar from './sidebar.jsx';
import auth from '../../utils/auth.js';

module.exports = withRouter(React.createClass({

  getInitialState: function() {
    return {
      loggedIn: auth.loggedIn(),
      open: false,
    };
  },
  handleClick: function(e){
    e.preventDefault();
    this.setState({loggedIn: this.state.loggedIn, open: !this.state.open});
  },
  logout: function(e){
    e.preventDefault();
    auth.logout(() => {
      this.setState({loggedIn: false});
      this.props.router.replace('/');
    });
  },

  render: function() {
    return (
      <div className={'container' + (this.state.open ? ' sidebar-open' : '')} id="app-container">
        <Sidebar open={this.state.open}/>
        <div className="main-content">
          <div className="pure-g menu-bar">
            <div className="pure-u-1-6 pure-u-sm-1-3">
              <div className="burger-button" id="sidebar-toggle" onClick={this.handleClick}>
                <span className="bar" id="top"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </div>
            </div>
            <div className="pure-u-1-2 pure-u-sm-1-3 centered">
              <h1>{this.props.title}</h1>
            </div>
            <div className="pure-u-1-3">
              {this.state.loggedIn ? (
                <div className="button" id="top-right" onClick={this.logout} >Log out</div>
                ) : (
                  <Link className="button" id="top-right" to="/login" >Sign In</Link>
                  )}
                </div>
              </div>

              <div className="content centered">
                {this.props.children}
              </div>
              <div className="love">Made with ❤  by <a href="http://techsoc.io">TechSoc</a></div>
            </div>
          </div>
           );
  }
}));
