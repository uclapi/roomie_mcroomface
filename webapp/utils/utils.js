import config from '../config.js';

var exports = {
  setCookie: function(cname, cvalue, exdays){
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = 'expires='+ d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'; 
  },
  getCookie: function(cname){
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' '){
        c = c.substring(1);
      }
      if(c.indexOf(name) == 0){
        return c.substring(name.length,c.length);
      }
    }
    return '';
  },
  authenticatedRequest: function(url, method, context){
    fetch(config.domain + url, {
      method: method,
      headers:{
        'Authorization': 'Token ' + this.getCookie('token')
      },
      mode: 'cors',
    }).then(function(res){
      if(res.status === 200){
        return res.json();
      } else {
        context.props.router.push({
          pathname: '/login',
          state: {nextPathname: context.props.location.pathname }
        });
      }
    });
  }
};

module.exports = exports;
