import React from 'react';
import {withRouter} from 'react-router';
import 'whatwg-fetch';

import Layout from '../../components/layout.jsx';

import auth from '../../../utils/auth.js';
import utils from '../../../utils/utils.js';

var labelStyle = {
  width: '4em'
};

module.exports = withRouter(React.createClass({
  getInitialState: function(){
    return{
      error: false,
      loading: false, 
			win: null
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
  messageReceived: function(text, id, channel){
    var json = JSON.parse(atob(text));
    this.state.win.close();
    if(json.groups.indexOf('Group_3')>-1){
      localStorage.g3 = true;
    }
    if(json.groups.indexOf('Group_4')>-1){
      localStorage.g4 = true;
    }
    utils.setCookie('token', json.token, 7);

    const {location} = this.props;

    if (location.state && location.state.nextPathname) {
      this.props.router.replace(location.state.nextPathname);
    } else {
      this.props.router.replace('/');
    }
  },
  login: function(){
		this.setState({
      win: window.open()
    })	
    var that = this;
    fetch('https://enghub.io/api/v1/user.login.getToken/', {
      method: 'GET',
      mode: 'cors'
    }).then(function(res){
      if(res.status === 200){
        return res.json();
      }
    }).then(function(json){
      var winRef = that.state.win;
      winRef.location = json.loginUrl;
      that.setState({
        win: winRef
      });
			var pushstream = new PushStream({
        useSSL: true,
        host: 'enghub.io',
        port: 443,
        modes: "longpolling",
        tagArgument: 'tag',
        timeArgument: 'time',
        timeout: 30000,
        messagesPublishedAfter: 5,
        urlPrefixLongpolling: '/api/v1/push.subscribe_longpoll'
			});

			pushstream.onmessage = that.messageReceived;
			pushstream.addChannel(json.sid);
			pushstream.connect();  
    });
  },
  render: function() {
    return (
      <Layout title="Login">
        <button className="pure-button pure-button-primary loginButton" onClick={this.login}>Login throught UCL</button>
      </Layout>
    );
  }
}));
