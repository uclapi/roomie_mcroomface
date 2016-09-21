import React from 'react';
import {Link, withRouter} from 'react-router';
import Layout from '../components/layout.jsx';
import moment from 'moment';
import 'whatwg-fetch';

module.exports = withRouter(React.createClass({
  bookRoom: function(e){
    e.preventDefault();
    var that = this;
    console.log('called');
    fetch('http://localhost:8000/api/v1/book_room_normal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Token ' + localStorage.token
      },
      mode: 'cors',
      body: 'room_id='+ this.props.params.roomId +
        '&date='+ moment(this.props.params.dateTime).format('YYYYMMDD')+
        '&start_time='+ moment(this.props.params.dateTime).format('k:mm')+
        '&end_time='+ moment(this.props.params.dateTime).add(parseInt(this.refs.duration.value.substr(0,1)), 'hour').format('k:mm')+
        '&notes='+ this.refs.notes.value
    }).then(function(res){
      res.json().then(function(json){
        console.log(json);
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
      result: ''
    };
  },
  render: function(){
    return <Layout title="Confirm Booking">
      <div className="confirmBooking">
        <div className="pure-g">
          <div className="pure-u-1 card">
            <h1>{this.props.params.roomId}</h1>
            <p>Date: {moment(this.props.params.dateTime).format('dddd Do MMMM')}</p>
            <p>Time: {moment(this.props.params.dateTime).format('kk:mm')}</p>
            <form className="pure-form pure-form-stacked" onSubmit={this.bookRoom}>
              <fieldset>
                <label htmlFor="duration">Duration</label>
                <select ref="duration" id="duration">
                  <option>1 Hour</option>
                  <option>2 Hours</option>
                  <option>3 Hours</option>
                </select>
                <textarea ref="notes" placeholder="Notes..."></textarea>
                <button type="submit" className="pure-button pure-button-primary">Book</button>
              </fieldset>
            </form>
            <div className="result">
              {this.state.result}
            </div>
          </div>
        </div>
        </div>
    </Layout>
  }
}));
