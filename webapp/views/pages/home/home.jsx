import React from 'react';
import { Link } from 'react-router';
import Layout from '../../components/layout.jsx' ;
import auth from '../../../utils/auth.js';

module.exports = React.createClass({
  displayName: 'Home',
  render:function() {
    return (
      <Layout title="">
        <div className="header">
          <div className="pure-g">
            <div className="pure-u-sm-1-8 pure-u-md-1-4 pure-u-lg-1-3"></div>
            <div className="pure-u-1 pure-u-sm-18-24 pure-u-md-1-2 pure-u-lg-1-3 centered">
              <h1>Welcome to the Engineering Hub</h1>
              {auth.loggedIn()?
                (<Link className="button" to="/rooms">Book a room now</Link>):
                (<div>
                  <Link className="button" to="/login">Sign in</Link>
                  <p>If you're an undergraduate student part of the engineering faculty you can click the button above to log in and start booking rooms.</p>
                </div>)
              }
            </div>
            <div className="pure-u-sm-1-8 pure-u-md-1-4 pure-u-lg-1-3"></div>
          </div>
        </div>
        <div className="body">
          <div className="pure-g">
            <div className="pure-u-1-24 pure-u-sm-1-8 pure-u-md-1-4 "></div>
            <div className="pure-u-22-24 pure-u-sm-18-24 pure-u-md-1-2">
              <div className="card">
                <p>
                  The Engineering Hub is a new student hub that opened in October 2016. It's located in the Henry Morley Building. The space is open to all students in undergraduate engineering and all members of engineering related student societies. The hub includes 2 large social working spaces and 5 group work rooms.
                </p>
                <h2>Map</h2>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.4189593493284!2d-0.13415328422942108!3d51.52387507963791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMxJzI1LjkiTiAwwrAwNyc1NS4xIlc!5e0!3m2!1sen!2sus!4v1480692047899" width="100%" height="500vw" frameBorder="0" style={{border: 0}} allowFullScreen></iframe>
                <h2>Directions</h2>
                <p>Get detailed directions <a href="http://www.ucl.ac.uk/maps/henry-morley-building">here.</a></p>
              </div>
            </div>
            <div className="pure-u-1-24 pure-u-sm-1-8 pure-u-md-1-4"></div>
          </div>
        </div>
      </Layout>
    );
  }
});
