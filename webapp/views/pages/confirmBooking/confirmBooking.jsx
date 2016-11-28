import React from 'react';
import {withRouter} from 'react-router';
import Layout from '../../components/layout.jsx';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'whatwg-fetch';
import IndividualForm from './individualForm.jsx';
import SocietyForm from './societyForm.jsx';
import utils from '../../../utils/utils.js';
import config from '../../../config.js';

module.exports = withRouter(React.createClass({
  displayName: 'Confirm Booking',
  propTypes:{
    params: React.PropTypes.object,
    roomId: React.PropTypes.string,
    dateTime: React.PropTypes.string

  },
  bookRoom: function(society_booking){
    var that = this;
    fetch(config.domain + '/api/v1/rooms.book/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + utils.getCookie('token')
      },
      mode: 'cors',
      body: 'room_id='+ this.props.params.roomId +
        '&date='+ moment(this.props.params.dateTime).format('YYYYMMDD')+
        '&start_time='+ moment(this.props.params.dateTime).add(1, 'minute').format('kk:mm')+
        '&end_time='+ moment(this.props.params.dateTime).add(this.state.duration, 'hour').format('kk:mm')+
        (this.state.notes?'&notes='+this.state.notes:'')+ 
        '&society_booking=' + society_booking +
        (this.state.society?'&society='+this.state.society:'')+
        (this.state.eventName?'&event_name='+this.state.eventName:'')
      
    }).then(function(res){
      res.json().then(function(json){
        that.setState({
          loading: false
        });
        if(json.success){
          that.setState({
            result: 'Room booked successfully'
          });
        } else {
          that.setState({
            result: json.error
          });
        }
      });
    });
  },
  getInitialState:function(){
    return {
      result: '',
      duration: 0,
      societyRoom:false,
      loading: true
    };
  },
  sendFormData: function(duration, notes, society_booking, society, eventName){
    this.setState({
      duration: duration,
      notes:notes,
      society:society,
      eventName:eventName,
      loading: true
    },function(){
      this.bookRoom(society_booking);
    });
  },
  getRoomInfo: function(){
    var that = this;
    fetch(config.domain + '/api/v1/rooms.list/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + utils.getCookie('token')
      },
      mode: 'cors'
    }).then(function(res){
      res.json().then(function(json){
        for(var room of json){
          if(room.room_id === that.props.params.roomId){
            that.setState({
              societyRoom: !room.individual_access,
              loading: false
            });
          }
        }
      });
    });
  },
  componentDidMount:function(){
    this.getRoomInfo();
  },
  render: function(){
    return <Layout title="Book">
      <div className="confirmBooking">
      {this.state.loading ? (
        <div className="spinnerContainer">
          <div className="spinner"></div>
        </div>
        ):(
          <div className="pure-g">
            <div className="pure-u-1 card">
              {localStorage.g3 ? (
                this.state.societyRoom ? (
                  <SocietyForm 
                    dateTime={this.props.params.dateTime} 
                    roomId={this.props.params.roomId}
                    callBack={this.sendFormData}
                  />
                ):(
                  <Tabs>
                    <TabList>
                      <Tab>
                        Individual Booking
                      </Tab>
                      <Tab>
                        Society Booking
                      </Tab>
                    </TabList>
                    <TabPanel>
                      <IndividualForm
                        dateTime={this.props.params.dateTime} 
                        roomId={this.props.params.roomId}
                        callBack={this.sendFormData}
                      /> 
                    </TabPanel>
                    <TabPanel>
                      <SocietyForm 
                        dateTime={this.props.params.dateTime} 
                        roomId={this.props.params.roomId}
                        callBack={this.sendFormData}
                      />
                    </TabPanel>
                  </Tabs>
                )
              ):(
                <IndividualForm
                  dateTime={this.props.params.dateTime} 
                  roomId={this.props.params.roomId}
                  callBack={this.sendFormData}
                /> 
              )}
              
              <div className="result">
                {this.state.result}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>;
  }
}));
