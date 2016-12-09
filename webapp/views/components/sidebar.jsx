import React from 'react';
import { Link } from 'react-router';
module.exports = React.createClass({
  displayName: 'Sidebar',
  render:function () {
    return (
      <div className={ 'sideBar ' + (this.props.open ? '' : 'closed')}>
        <div className="pure-menu">
          <Link className="pure-menu-heading" to="/">Engineering Hub</Link>
          <ul className="pure-menu-list">
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/">Home</Link>
            </li>
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/rooms">Rooms</Link>
            </li>
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/profile">Profile</Link>
            </li>
            <li className="pure-menu-item">
              <a className="pure-menu-link" href="https://roomie.uservoice.com/" >Feedback</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
