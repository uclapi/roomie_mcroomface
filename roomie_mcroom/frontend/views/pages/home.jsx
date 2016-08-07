import React from 'react'
import { Link } from 'react-router'
class Home extends React.Component {
  render() {
    return (
      <div className='test'>
        <h1>Hello world</h1>
        <h2><Link to='/test'>Test</Link></h2>
      </div>
    );
  }
}

export default Home;
