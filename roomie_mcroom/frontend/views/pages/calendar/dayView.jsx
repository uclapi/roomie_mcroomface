import React from 'react'
import { Link } from 'react-router'

var Slot = React.createClass({
  getInitialState: function(){
    return{
      content:this.props.time+":00"
    }
  },

  mouseOver: function(e){
    e.preventDefault();
    if(this.props.taken){
      this.setState({content:"Slot not available"});
    } else {
      this.setState({content:"Book this slot"});
    }
  },

  mouseOut: function(e){
    e.preventDefault();
    this.setState({content:this.props.time+":00"});
  },

  render: function(){
    return (
      <div className={"slot " + (this.props.taken ? ( "taken" ) : ( "free" ))} 
           onMouseOver={this.mouseOver} 
           onMouseOut={this.mouseOut}>
        <div className="time" id={"slot"+this.props.time}>{this.state.content}</div>
      </div>
    );
  }
})
module.exports = React.createClass({
  getBookings: function(){
    var slots = [];
    for(var i = 0; i < 24; i++){
      slots[i] = 0;
    }
    for(var i = 0; i < 8; i++){
      slots[i] = 1;
    }
    for(var i = 22; i < 24; i++){
      slots[i] = 1;
    }
    var day = this.props.date.format('ddd');
    if(day === 'Sat' || day === 'Sun'){
      slots[8] = 1;
      for(var i = 19; i < 22; i++){
        slots[i] = 1;
      }
    }

    for(var i = 0; i < this.state.bookings.length; i++){
      var start = parseInt(this.state.bookings[i].start.substring(0,2));
      var end = parseInt(this.state.bookings[i].end.substring(0,2));

      for(var j = start; j < end; j++){
        slots[j] = 1;
      }
    }

    return slots;
  },
  getInitialState: function() {
    return {
      slots:[],
      bookings: [
        {
          "username": "emily emily emellee",
					"notes": "yoyoy -UCLU Technology Society",
					"end": "13:00:00",
					"start": "11:00:00" 
        }
      ]
    }
  },
  componentDidMount: function(){
    this.setState({
      slots: this.getBookings()
    });
  },
  render: function() {
    return <div className={this.props.rightBorder ? "dayView rightBorder": "dayView"}>
      <div className="date">{this.props.date.format('Do MMM')}</div>
      <div className="slots">
        {this.state.slots.map((taken, i) =>{
          return <Slot key={i} time={i} taken={taken}/>
        })}
      </div>
      <div className="endSlot"></div>
    </div>
  }
})
