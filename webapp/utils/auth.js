import 'whatwg-fetch';
import utils from './utils.js';
import config from '../config.js';

module.exports = {
  login(user, pass, cb) {
    cb = arguments[arguments.length - 1];
    fetch(config.domain + '/api/v1/user.login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      mode: 'cors',
      body: 'username='+user+'&password='+pass
    }).then(function(res){
      return res.json().then(function(res){
        if(res.token){
          if(res.groups.indexOf('Group_3')>-1){
            localStorage.g3 = true;
          }
          if(res.groups.indexOf('Group_4')>-1){
            localStorage.g4 = true;
          }
          utils.setCookie('token', res.token, 7);
          cb(true);
        } else {
          cb(false);
        }
      });
    });
  },

  getToken() {
    return utils.getCookie('token');
  },

  logout(cb) {
    fetch(config.domain + '/api/v1/user.logout/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + utils.getCookie('token')
      },
      mode: 'cors'
    }).then(()=>{
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      delete localStorage.g3;
      delete localStorage.g4;
      if (cb) cb();
    });
  },

  loggedIn() {
    return !!utils.getCookie('token');
  }
};
