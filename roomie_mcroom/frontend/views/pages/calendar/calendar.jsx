import React from 'react'
import { Link } from 'react-router'
import Layout from '../../components/layout.jsx';

import DayView from './dayView.jsx';

module.exports = React.createClass({
  render: function() {
    return (
      <Layout>
      <div className="pure-g">
        <div className="pure-u-sm-1-8 pure-u-md-1-4 pure-u-lg-1-3"></div>
        <div className="pure-u-1 pure-u-sm-18-24 pure-u-md-1-2 pure-u-lg-1-3 centered">
            <div className="card">
              <h1>Calendar</h1>
              <DayView/>
            </div>
        </div>
        <div className="pure-u-sm-1-8 pure-u-md-1-4 pure-u-lg-1-3"></div>
      </div>
      </Layout>
    );
  }
});
