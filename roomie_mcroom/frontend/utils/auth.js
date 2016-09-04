import 'whatwg-fetch';
module.exports = {
  login(email, pass, cb) {
    cb = arguments[arguments.length - 1]
    // if (localStorage.token) {
    //   if (cb) cb(true)
    //   return
    // }
    fetch("https://c783397b.ngrok.io/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        mode: 'cors',
        body: "username="+email+"&password="+pass
    }).then(function(res){
      return res.json().then(function(res){
        console.log(res);
        fetch("https://c783397b.ngrok.io/get_room_bookings", {
          mode: 'cors',
          credentials: 'include'
        }).then(function(res){
          return res.json().then(function(res){
            console.log(res);
          })
        })
      })
    });
  },

  getToken() {
    return localStorage.token
  },

  logout(cb) {
    delete localStorage.token
    if (cb) cb()
  },

  loggedIn() {
    return !!localStorage.token
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
