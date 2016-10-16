import React from 'react';
import moment from 'moment';

module.exports = React.createClass({
  displayName: 'Individual Form',
  propTypes: {
    roomId: React.PropTypes.string,
    dateTime: React.PropTypes.string,
    callBack: React.PropTypes.func
  },
  submitForm: function(e){
    e.preventDefault();
    var duration = parseInt(this.refs.duration.value.substr(0,1));
    var notes = 'none';
    this.props.callBack(duration, notes, 'False', null, null); 
  },
  render: function(){
    return ( 
      <div>
        <h1>{this.props.roomId}</h1>
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
            <button type="submit" className="pure-button pure-button-primary">Book</button>
          </fieldset>
        </form>
      </div>
    );
  }
});
