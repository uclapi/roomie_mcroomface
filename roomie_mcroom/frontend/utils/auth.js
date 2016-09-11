import 'whatwg-fetch';
module.exports = {
  login(user, pass, cb) {
    cb = arguments[arguments.length - 1]
    fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        mode: 'cors',
        body: "username="+user+"&password="+pass
    }).then(function(res){
      return res.json().then(function(res){
        if(res.token){
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
    delete localStorage.token;
    if (cb) cb()
  },

  loggedIn() {
    return !!localStorage.token;
  }
}

function pretendRequest(email, pass, cb) {
  setTimeout(() => {
    if (email === 'joe@example.com' && pass === 'password1') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7)
      })
    } else {
      cb({ authenticated: false })
    }
  }, 0)
}
// pretendRequest(email, pass, (res) => {
//   if (res.authenticated) {
//     localStorage.token = res.token
//     if (cb) cb(true)
//   } else {
//     if (cb) cb(false)
//   }
// })
