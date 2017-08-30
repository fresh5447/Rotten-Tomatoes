import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { login, logout, isLoggedIn } from '../utils/AuthService'
import '../App.css'

class Nav extends Component {
  render () {
    return (
      <nav className='navbar navbar-default'>
        <div className='navbar-header'>
          <Link className='navbar-brand' to='/'>Rotten Tomatoes</Link>
        </div>
        <ul className='nav navbar-nav'>
          <li>
            <Link to='/'>Home</Link>
            <Link className='btn btn-secondary' to='/login'>Login</Link>
            <Link to='/create-movie'>Create Movie</Link>
            <Link to='/movie-list'>Movie List</Link>
            <button onClick={this.props.logout}> Logout </button>
          </li>
        </ul>
      </nav>
    )
  }
}

export default Nav
