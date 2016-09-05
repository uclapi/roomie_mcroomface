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
        <div className="time" id={"slot"+this.props.key}>{this.state.content}</div>
      </div>
    );
  }
})
module.exports = React.createClass({
  getInitialState: function() {
    return {
      slots:[1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0,1,0,1,1,1,1,1],
      date:'31/08/16'
    }
  },
  render: function() {
    return <div className="dayView">
      <div className="date">{this.state.date}</div>
      <div className="slots">
        {this.state.slots.map((taken, i) =>{
          return <Slot key={i} time={i} taken={taken}/>
        })}
      </div>
      <div className="endSlot"></div>
    </div>
  }
})
