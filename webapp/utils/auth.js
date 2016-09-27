import 'whatwg-fetch';
module.exports = {
  login(user, pass, cb) {
    cb = arguments[arguments.length - 1]
    fetch("http://localhost:8000/api/v1/user.login/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        mode: 'cors',
        body: "username="+user+"&password="+pass
    }).then(function(res){
      return res.json().then(function(res){
        if(res.token){
          if(res.groups.indexOf('Group_3')>-1){
            localStorage.society = true;
          }
          localStorage.token = res.token;
          cb(true);
        } else {
          cb(false);
        }
      })
    });
  },

  getToken() {
    return localStorage.token
  },

  logout(cb) {
    fetch('http://localhost:8000/api/v1/user.logout/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + localStorage.token
      },
      mode: 'cors'
    });
    delete localStorage.token;
    delete localStorage.society;
    if (cb) cb()
  },

  loggedIn() {
    return !!localStorage.token;
  }
}
