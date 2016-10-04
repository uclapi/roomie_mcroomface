import React from 'react';
import {withRouter} from 'react-router';
import Layout from '../../components/layout.jsx';
import 'whatwg-fetch';
import moment from 'moment';

module.exports = withRouter(React.createClass({
  getInitialState: function(){
    return {
      loading: 0,
      profile:{},
      bookings:[]
    };
  },
  getUserInfo: function(){
    var that = this;
    fetch('http://localhost:8000/api/v1/user.info/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + localStorage.token
      },
      mode: 'cors'
    }).then(function(res){
      that.setState({
        loading: that.state.loading + 1
      });
      if(res.status === 200){
        res.json().then(function(json){
          console.log(json);
          that.setState({
            profile: json
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
  getBookings: function(){
    var that = this;
    fetch('http://localhost:8000/api/v1/user.bookings/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + localStorage.token
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
                  <h3>Societies you belong to</h3>
                  <ul>
                    {this.state.profile.societies[0].map((society, i)=>{
                      return <li key={i}>{society}</li>
                      })}
                    </ul>
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
