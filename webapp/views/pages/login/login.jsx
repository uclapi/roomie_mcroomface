import React from 'react';
import {withRouter} from 'react-router-dom';

import auth from '../../../utils/auth.js';

var createReactClass = require('create-react-class');

var labelStyle = {
  width: '4em'
};

module.exports = withRouter(createReactClass({
  getInitialState: function(){
    return{
      error: false,
      loading: false
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
    this.setState({
      loading:true
    });
    var email = this.refs.email.value;
    var password = this.refs.password.value;

    auth.login(email, password, (loggedIn) => {
      if(!loggedIn){
        return this.setState({
          error:true,
          loading: false
        });
      }
      const {location} = this.props;

      if (location.state && location.state.nextPathname) {
        this.props.router.replace(location.state.nextPathname);
      } else {
        this.props.router.replace('/');
      }
    });
  },

  render: function() {
    return (
      <div className="loginPage centered">
        {this.state.loading ? (
          <div className="spinnerContainer">
            <div className="spinner"></div>
          </div>
          ):(<div></div>)}
        <form className="pure-form pure-form-aligned" onSubmit={this.handleLogin}>
          <fieldset>
            <div className="pure-control-group">
              <label htmlFor="name" style={labelStyle} >Email</label>
              <input id="name" ref="email" type="text" placeholder="Email" className="pure-input-rounded" required/>
            </div>
            <div className="pure-control-group">
              <label htmlFor="password" style={labelStyle} >Password</label>
              <input id="password" ref="password" type="password" placeholder="Password" className="pure-input-rounded" required/>
            </div>
            {this.state.error ? (
              <div className="warningLabel">Email or password is incorrect</div>
              ):(
                <div className="warningLabel"></div>
              )}
            <button type="submit" className="pure-button pure-button-primary">Submit</button>
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
    );
  }
}));
