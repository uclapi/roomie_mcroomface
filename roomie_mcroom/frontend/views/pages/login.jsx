import React from 'react';
import {Link, withRouter} from 'react-router';
import Layout from '../components/layout.jsx';

import auth from '../../utils/auth.js';

var labelStyle = {
   width: '4em'
};

var buttonStyle = {
   marginLeft : '5em'
};

module.exports = withRouter(React.createClass({
  getInitialState: function(){
    return{
      error: true
    };
  },
  setVisible: function(){
    var popUp = document.getElementById('pu');
    popUp.style.display = 'block';
  },
  setInvisible: function(){
    var popUp = document.getElementById('pu');
    popUp.style.display = 'none';
  },
  handleLogin: function(e){
    e.preventDefault();

    var email = this.refs.email.value;
    var password = this.refs.password.value;

    auth.login(email, password, (loggedIn) => {
      if(!loggedIn){
        return this.setState({error:true});
      }
			const {location} = this.props

        if (location.state && location.state.nextPathname) {
          this.props.router.replace(location.state.nextPathname)
        } else {
          this.props.router.replace('/')
        }
    })
  },

  render: function() {
    return (
      <div className="loginPage centered">
        <form className="pure-form pure-form-aligned" onSubmit={this.handleLogin}>
          <fieldset>
            <div className="pure-control-group">
              <label htmlFor="name" style={labelStyle} >Email</label>
              <input id="name" ref="email" type="text" placeholder="Email" className="pure-input-rounded"/>
            </div>
            <div className="pure-control-group">
              <label htmlFor="password" style={labelStyle} >Password</label>
              <input id="password" ref="password" type="password" placeholder="Password" className="pure-input-rounded"/>
            </div>
            <div className="pure-controls" style={buttonStyle}>
              <button type="submit" className="pure-button pure-button-primary">Submit</button>
            </div>
          </fieldset>
          <a href="#" onClick={this.setVisible}>Dont have an account?</a>
        </form>
        <div className="popup" id="pu" onClick={this.setInvisible}>
          <div className="content">
            You can only book rooms in the engineering hub if you are an engineering student or you a in a society 
            related to the engineering department. If this is the case you should have recieved an email with a link
            to create an account.
          </div>
        </div>
      </div>
    )
  }
}));