import React from 'react'
import { Link } from 'react-router'

var Slot = React.createClass({

  render: function(){
    return <div className={"slot " + (this.props.taken ? ( "taken" ) : ( "free" ))}>
      <div className="time">{this.props.time}:00</div>
    </div>
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
