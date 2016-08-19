import React from 'react'
import { Link } from 'react-router'

class Sidebar extends React.Component {
  render() {
    return (
      <div className="sideBar">
        <div className="pure-menu">
          <Link className="pure-menu-heading" to="/">Engineering Hub</Link>
          <ul className="pure-menu-list">
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/">Home</Link>
            </li>
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/">Book a Room</Link>
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
}

export default Sidebar;
