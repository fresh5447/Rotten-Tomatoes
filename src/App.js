import React, { Component } from 'react'
import Provider from './containers/Provider'
import { BrowserRouter as Router } from 'react-router-dom'

class App extends Component {
  render () {
    return (
      <Router>
        <Provider />
      </Router>
    )
  }
}

export default App
