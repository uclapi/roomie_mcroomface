import React from 'react'
import { Link } from 'react-router'

module.exports = React.createClass({
  render:function () {
    return (
      <div className="sideBar">
        <div className="pure-menu">
          <Link className="pure-menu-heading" to="/">Engineering Hub</Link>
          <ul className="pure-menu-list">
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/test">Home</Link>
            </li>
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/login">Book a Room</Link>
            </li>
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/">Calendar</Link>
            </li>
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/">Rooms</Link>
            </li>
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/">Society Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
});
