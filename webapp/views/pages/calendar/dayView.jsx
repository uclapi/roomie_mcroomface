import React from 'react'
import { Link , withRouter} from 'react-router'
import 'whatwg-fetch';
import utils from '../../../utils/utils.js';
import config from '../../../config.js';
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
           <div className="time" id={"slot"+this.props.time}>
             {this.props.taken ? ( this.state.content ):( <Link to={'/book/'+ this.props.roomId + '/' + this.props.date + 'T' + ('0' + this.props.time).slice(-2) + ':00:00'}> { this.state.content } </Link> )}
           </div>
      </div>
    );
  }
})
module.exports = withRouter(React.createClass({
  setSlots: function(){
    var slots = [];
    for(var i = 0; i < 14; i++){
      slots[i] = 0;
    }
    var day = this.props.date.format('ddd');
    if(day === 'Sat' || day === 'Sun'){
      slots[0] = 1;
      for(var i = 11; i < 14; i++){
        slots[i] = 1;
      }
    }

    for(var i = 0; i < this.state.bookings.length; i++){
      var start = parseInt(this.state.bookings[i].start.substring(0,2));
      var end = parseInt(this.state.bookings[i].end.substring(0,2));

      for(var j = start; j < end; j++){
        slots[j - 8] = 1;
      }
    }
    return slots;
  },
  getBookings: function(){
    var that = this;
    fetch(config.domain + '/api/v1/rooms.bookings/?room_id=' +
          this.props.roomId +
          '&date='+
          this.props.date.format('YYYYMMDD'), {
            method:'GET',
            headers: {
              'Authorization': 'Token '+ utils.getCookie('token')
            },
            mode:'cors'
          }).then(function(res){
            if(res.status === 200){
              that.props.callback();
              res.json().then(function(json){
                that.setState({
                  bookings:json
                },()=>{
                  that.setState({
                    slots:that.setSlots()
                  })
                });
              })
            }else{
              that.props.router.push({
                pathname: '/login',
                state: {nextPathname: '/rooms'}
              });
            }
          })
  },
  getInitialState: function() {
    return {
      slots:[],
      bookings:[]
    }
  },
  componentDidMount: function(){
    this.getBookings();
  },
  componentDidUpdate: function(prevProps, prevState){
    if(this.props.date.format('YYYYMMDD') !== prevProps.date.format('YYYYMMDD')){
      this.getBookings();
    }
  },
  render: function() {
    return <div className={this.props.rightBorder ? "dayView rightBorder": "dayView"}>
      <div className="date">{this.props.date.format('dd Do')}</div>
      <div className="slots">
        {this.state.slots.map((taken, i) =>{
          return <Slot
            key={i}
            time={i + 8}
            taken={taken}
            date={this.props.date.format('YYYY[-]MM[-]DD')}
            roomId={this.props.roomId}/>
        })}
      </div>
      <div className="endSlot"></div>
    </div>
  }
}))
