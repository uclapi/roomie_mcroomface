import React from 'react';
import moment from 'moment';
import { Router } from 'react-router';
import utils from '../../../utils/utils.js';
import config from '../../../config.js';

module.exports = React.createClass({
  displayName: 'Society Form',
  propTypes: {
    roomId: React.PropTypes.string,
    dateTime: React.PropTypes.string,
    callBack: React.PropTypes.func
  },
  submitForm: function(e){
    e.preventDefault();
    console.log(this.refs.eventName.value);
    if(this.refs.eventName.value === ''){
      alert('Event name can\'t be empty.');
      return;
    }
    var duration = parseInt(this.refs.duration.value.substr(0,1));
    var notes = null;
    var society; 
    for (var societyPair of this.state.societies){
      console.log(societyPair);
      if(societyPair[0] === this.refs.society.value){
        society = societyPair[1];
        console.log('here');
      }
    }
    var eventName = this.refs.eventName.value;

    this.props.callBack(duration, notes, 'True', society, eventName); 
  },
  getSocieties: function(){
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
            societies: json.societies
          });
        });
      }else{
        that.props.router.push({
          pathname: '/login',
          state: {nextPathname: that.getPath()}
        });
      }
    });
  },
  getInitialState: function(){
    return {
      societies: []
    };
  },
  componentDidMount: function(){
    if(sessionStorage.societies){
      this.setState({
        societies:JSON.parse(sessionStorage.societies)
      });
    }else{
      this.getSocieties();
    }
  },
  componentWillUnmount: function(){
    sessionStorage.societies = JSON.stringify(this.state.societies);
  },
  render: function(){
    return ( 
      <div className="societyForm">
        <p>Date: {moment(this.props.dateTime).format('dddd Do MMMM')}</p>
        <p>Time: {moment(this.props.dateTime).format('kk:mm')}</p>
        <form className="pure-form pure-form-stacked" onSubmit={this.submitForm}>
          <fieldset>
            <label htmlFor="duration">Duration</label>
            <select ref="duration" id="duration">
              <option>1 Hour</option>
              <option>2 Hours</option>
              <option>3 Hours</option>
            </select>
            <label htmlFor="society">Society</label>
            <select ref="society" id="society">
              {this.state.societies.map((society, i) => {
                return <option key={i}>{society[0]}</option>;
              })}
            </select>
            <label htmlFor="eventName">Event name</label>
            <input type="text" id="eventName" ref="eventName"/>
            <button type="submit" className="pure-button pure-button-primary">Book</button>
          </fieldset>
        </form>
      </div>
    );
  }
});
