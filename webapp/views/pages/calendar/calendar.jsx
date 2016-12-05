import React from 'react';
import Layout from '../../components/layout.jsx';
import moment from 'moment';
import utils from '../../../utils/utils.js';
import config from '../../../config.js';

import DayView from './dayView.jsx';

module.exports = React.createClass({
  getInitialState:function(){
    return {
      date:moment(),
      loading: 0,
      roomName: ''
    }
  },
  updateLoading: function(){
    this.setState({
      loading: this.state.loading + 1
    });
  },
  addDay: function(e){
    e.preventDefault();
    this.setState({
      date:this.state.date.add(1, 'week')
    })
  },
  minusDay: function(e){
    e.preventDefault();
    this.setState({
      date:this.state.date.subtract(1, 'week')
    })
  },
  today: function(e){
    e.preventDefault();
    this.setState({
      date:moment()
    })
  },
  getRoomName: function(){
    var that = this;
    fetch(config.domain + '/api/v1/rooms.list/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token '+ utils.getCookie('token')
      },
      mode: 'cors'
    }).then(function(res){
      that.updateLoading();
      if(res.status === 200){
        res.json().then(function(res){
          for(var room of res){
            if(room.room_id === that.props.params.roomId){
              that.setState({
                roomName: room.room_name
              });
            }
          }
        });
      } else {
        that.props.router.push({
          pathname: '/login',
          state: {nextPathname: '/rooms'}
        });
      }
    });
  },
  componentDidMount: function(){
    this.getRoomName();
  },
  render: function() {
    return (
      <Layout title="Calendar">
        {this.state.loading < 7 ? (
          <div className="spinnerContainer">
            <div className="spinner"></div>
          </div>
        ):(<div></div>)}
        <div className="pure-g calendar" hidden={this.state.loading < 8 ? true:false}>
          <div className="pure-u-sm-1-12"></div>
          <div className="pure-u-1 pure-u-sm-20-24 centered">
            <div className="card">
              <h1>{this.state.roomName}</h1>
              <p>Opening times:<br/>
                Mon - Fri: 8:00 - 22:00<br/>
                Sat - Sun: 9:00 - 19:00</p>
              <div className="pure-button" onClick={this.minusDay}>&lt;</div>
              <div className="pure-button" onClick={this.today}>Today</div>
              <div className="pure-button" onClick={this.addDay}>&gt;</div>
              <div className="pure-g">
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(0, 'day')} rightBorder={true} roomId={this.props.params.roomId} callback={this.updateLoading}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(1,'day')} rightBorder={true}roomId={this.props.params.roomId}callback={this.updateLoading}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(2,'day')} rightBorder={true}roomId={this.props.params.roomId}callback={this.updateLoading}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(3,'day')} rightBorder={true}roomId={this.props.params.roomId}callback={this.updateLoading}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(4,'day')} rightBorder={true}roomId={this.props.params.roomId}callback={this.updateLoading}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(5,'day')} rightBorder={true}roomId={this.props.params.roomId}callback={this.updateLoading}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(6,'day')} rightBorder={false}roomId={this.props.params.roomId}callback={this.updateLoading}/>
                </div>
              </div>

            </div>
          </div>
          <div className="pure-u-sm-1-12"></div>
        </div>
      </Layout>
    );
  }
});
