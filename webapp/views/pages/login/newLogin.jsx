import React from 'react';
import {withRouter} from 'react-router';
import 'whatwg-fetch';

import auth from '../../../utils/auth.js';

var labelStyle = {
  width: '4em'
};

module.exports = withRouter(React.createClass({
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
    );
  }
}));
