import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

var createReactClass = require('create-react-class');

module.exports = createReactClass({
  displayName: 'Individual Form',
  propTypes: {
    roomId: PropTypes.string,
    dateTime: PropTypes.string,
    callBack: PropTypes.func
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
