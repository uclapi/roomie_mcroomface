import React from 'react'
import { Link } from 'react-router-dom'

var createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function(){
    return (
      <div className="error">
        <div className="content">
          <h1>Error 404 page not found</h1>
        </div>
      </div>
    )
  }
});
