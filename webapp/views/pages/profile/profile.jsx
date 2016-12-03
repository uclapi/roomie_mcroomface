import React from 'react';
import {withRouter} from 'react-router';
import Layout from '../../components/layout.jsx';
import 'whatwg-fetch';
import moment from 'moment';
import utils from '../../../utils/utils.js';
import config from '../../../config.js';

module.exports = withRouter(React.createClass({
  getInitialState: function(){
    return {
      loading: 0,
      profile:{
        societies: []
      },
      bookings:[]
    };
  },
  getUserInfo: function(){
    var that = this;
    fetch(config.domain + '/api/v1/user.info/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + utils.getCookie('token')
      },
      mode: 'cors'
    }).then(function(res){
      that.setState({
        loading: that.state.loading + 1
      });
      if(res.status === 200){
        res.json().then(function(json){
          that.setState({
            profile: json
          });
        });
      }else{
        that.props.router.push({
          pathname: '/login',
          state: {nextPathname: '/profile'}
        });
      }
    });
  },
  getBookings: function(){
    var that = this;
    fetch(config.domain + '/api/v1/user.bookings/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + utils.getCookie('token')
      },
      mode: 'cors'
    }).then(function(res){
      that.setState({
        loading: that.state.loading + 1
      });
      if(res.status === 200){
        res.json().then(function(json){
          that.setState({
            bookings: json
          });
        })
      }else{
        that.props.router.push({
          pathname: '/login',
          state: {nextPathname: '/profile'}
        });
      }
    })
  },
  deleteBooking: function(bookingId){
    var that = this;
    fetch(config.domain + '/api/v1/rooms.deleteBooking/?booking_id=' + bookingId, {
     method: 'GET',
      headers: {
        'Authorization': 'Token ' + utils.getCookie('token')
      },
      mode: 'cors'
    }).then(function(res){
      if(res.status === 200){
        res.json().then(function(json){
          if(json.error){
            alert(json.error);
          }else{
            var bookings = that.state.bookings;
            for(var i in bookings){
              if(bookings[i].booking_id === bookingId){
                delete bookings[i];
              }
            }
            that.setState({
              bookings:bookings
            });
          }
        });
      }
    })
  },
  getToken: function(societyId){
    var that = this;
    fetch(config.domain + '/api/v1/society.token/?society_id=' + societyId, {
     method: 'GET',
      headers: {
        'Authorization': 'Token ' + utils.getCookie('token')
      },
      mode: 'cors'
    }).then(function(res){
      if(res.status === 200){
        res.json().then(function(json){
          if(json.error){
            alert(json.error);
          }else{
            var profile = that.state.profile;
            for(var i in profile.societies){
              if(profile.societies[i][1] === societyId){
                profile.societies[i][2] = json.token; 
              }
            }
            that.setState({
              profile: profile
            });
          }
        });
      }
    });
  },
  addSocietyMember: function(e){
    e.preventDefault();
    fetch(config.domain + '/api/v1/society.addUser/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + utils.getCookie('token')
      },
      mode: 'cors',
      body: 'username=' + this.refs.username.value +
        '&society_id=' + this.refs.society.value
    }).then(function(res){
      if(res.status == 200){
        res.json().then(function(json){
          console.log(json);
          if(json.error){
            alert(json.error);
          }else{
            alert(json.success);
          }
        });
      }
    });
  },
  removeSocietyMember: function(e){
    e.preventDefault();
    fetch(config.domain + '/api/v1/society.deleteUser/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + utils.getCookie('token')
      },
      mode: 'cors',
      body: 'username=' + this.refs.username.value +
        '&society_id=' + this.refs.society.value
    }).then(function(res){
      if(res.status == 200){
        res.json().then(function(json){
          if(json.error){
            alert(json.error);
          }else{
            alert(json.success);
          }
        });
      }
    });
  },
  componentDidMount: function(){
    this.getUserInfo();
    this.getBookings();
  },
  render: function() {
    return (
      <Layout title="Profile">
        <div className="profile">
          {this.state.loading < 2 ? (
            <div className="spinnerContainer">
              <div className="spinner"></div>
            </div>
          ):(
            <div>
              <div className="pure-g panel">
                <div className="pure-u-sm-1-8 pure-u-md-1-4 pure-u-lg-1-3"></div>
                <div className="pure-u-1 pure-u-sm-18-24 pure-u-md-1-2 pure-u-lg-1-3 centered">
                  <h2>{this.state.profile.email}</h2>
                  <h3>Time left this week: {this.state.profile.quota_left} minutes</h3>
                  {this.state.profile.societies.length === 0?(null):(
                    <div>
                      <h3>You are a committee member of the following societies</h3>
                      <ul>
                        {this.state.profile.societies.map((society, i)=>{
                          return <li key={i}>
                            {society[0]} 
                            {localStorage.g4?(
                              society[2]?( ' API Key: ' +society[2]):
                                (<button className="pure-button" onClick={() => this.getToken(society[1])}>
                                  Get API Key
                                </button>)
                            ):null}
                            <hr/>
                          </li>;
                        })}
                      </ul>
                      </div>
                  )}
                  {localStorage.g4?(
                    <form className="pure-form">
                      <fieldset>
                        <legend>Add/remove someone from a society</legend>
                        <input id="username" ref="username" type="text" placeholder="Username"/>
                        <select id="society" ref="society">
                          {this.state.profile.societies.map((society, i)=>{
                            return <option id={i} value={society[1]}>{society[0]}</option>
                          })}
                        </select>
                        <button className="pure-button pure-button-primary" onClick={this.addSocietyMember}>Add</button>
                        <button className="pure-button pure-button-primary" onClick={this.removeSocietyMember}>Remove</button>
                      </fieldset>
                    </form>
                  ):null}
                </div>
                <div className="pure-u-sm-1-8 pure-u-md-1-4 pure-u-lg-1-3"></div>
              </div>
              <div className="pure-g">
                <div className="pure-u-1">
                  <h1>Your bookings</h1>
                </div>
                {this.state.bookings.map((booking, i) => {
                  return <div key={i} className="pure-u-1 pure-u-sm-1-2 pure-u-md-1-3 pure-u-lg-1-4 pure-u-xl-1-5">
                    <div className="card centered">
                      <h2>{moment(booking.date).format('ddd do MMM')}</h2>
                      <h3>Start time: {booking.start}</h3>
                      <h3>End time: {booking.end}</h3>
                      <h4>Notes: {booking.notes}</h4>
                      <button className="pure-button button-error" onClick={() => this.deleteBooking(booking.booking_id)}>Delete booking</button>
                    </div>
                  </div>
                })}
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }
}));
