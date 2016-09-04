import React from 'react'
import { Link } from 'react-router'
import Layout from '../components/layout.jsx' 

module.exports = React.createClass({
  render:function() {
    return (
      <Layout>
        <div className="header">
          <div className="pure-g">
            <div className="pure-u-sm-1-8 pure-u-md-1-4 pure-u-lg-1-3"></div>
            <div className="pure-u-1 pure-u-sm-18-24 pure-u-md-1-2 pure-u-lg-1-3 centered">
              <h1>Welcome to the Engineering Hub</h1>
              <Link className="button" to="/">Book a room now</Link>
            </div>
            <div className="pure-u-sm-1-8 pure-u-md-1-4 pure-u-lg-1-3"></div>
          </div>
        </div>
        <div className="body">
          <div className="pure-g">
            <div className="pure-u-1-24 pure-u-sm-1-8 pure-u-md-1-4 "></div>
            <div className="pure-u-22-24 pure-u-sm-18-24 pure-u-md-1-2">
              <div className="card">
                <h2>What?</h2>
                <p>
                  The engineering hub is a new bookable space only for engineering students and members of societies
                  related to the engineering department. Here engineers are free to do whatever they want, which will 
                  mostly involve lots of maths and programming probably...
                </p>
                <h2>Where?</h2>
                <p>
                  Its hidden away round the back of the church becuase no one else wants to interact with engineers.
                </p>
              </div>
            </div>
            <div className="pure-u-1-24 pure-u-sm-1-8 pure-u-md-1-4"></div>
          </div>
        </div>
      </Layout>
    );
  }
});
