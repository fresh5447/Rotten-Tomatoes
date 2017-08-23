import React, {Component} from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

import Layout from '../components/Layout'

const networkInterface = createNetworkInterface({
  uri: process.env.REACT_APP_GRAPH_COOL_URL
})

// For Authentication
networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    // get the authentication token from local storage if it exists
    if (localStorage.getItem('id_token')) {
      req.options.headers.authorization = `Bearer ${localStorage.getItem('id_token')}`
    }
    next()
  }
}])

const client = new ApolloClient({
  networkInterface
})

class Provider extends Component {
  render () {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Layout />
        </Router>
      </ApolloProvider>
    )
  }
}

export default Provider
