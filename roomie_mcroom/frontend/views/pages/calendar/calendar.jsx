import React from 'react';
import { Link } from 'react-router';
import Layout from '../../components/layout.jsx';
import moment from 'moment';

import DayView from './dayView.jsx';

module.exports = React.createClass({
  getInitialState:function(){
    return {
      date:moment()
    }
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
  render: function() {
    return (
      <Layout title="Calendar">
      <div className="pure-g calendar">
        <div className="pure-u-sm-1-12"></div>
        <div className="pure-u-1 pure-u-sm-20-24 centered">
            <div className="card">
              <h1>{this.props.params.roomId}</h1>
              <div className="pure-button" onClick={this.minusDay}>&lt;</div>
              <div className="pure-button" onClick={this.today}>Today</div>
              <div className="pure-button" onClick={this.addDay}>&gt;</div>
              <div className="pure-g">
                <div className="pure-u-1-7">
                  <DayView date={this.state.date} rightBorder={true} roomId={this.props.params.roomId}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(1,'day')} rightBorder={true}roomId={this.props.params.roomId}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(2,'day')} rightBorder={true}roomId={this.props.params.roomId}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(3,'day')} rightBorder={true}roomId={this.props.params.roomId}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(4,'day')} rightBorder={true}roomId={this.props.params.roomId}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(5,'day')} rightBorder={true}roomId={this.props.params.roomId}/>
                </div>
                <div className="pure-u-1-7">
                  <DayView date={this.state.date.clone().add(6,'day')} rightBorder={false}roomId={this.props.params.roomId}/>
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
