import React from 'react'
import ReactDOM from 'react-dom'
import ListMovie from './components/ListMovie'
import CreateMovie from './components/CreateMovie'
import Callback from './components/Callback'
import { Router, Route, browserHistory } from 'react-router'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import 'tachyons'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import { requireAuth } from './utils/AuthService'
import 'bootstrap/dist/css/bootstrap.css'

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

ReactDOM.render((
  <ApolloProvider client={client}>
    <Router history={browserHistory}>
      <Route path='/' component={ListMovie} />
      <Route path='/create' component={CreateMovie} onEnter={requireAuth} />
      <Route path='/callback' component={Callback} />
    </Router>
  </ApolloProvider>
), document.getElementById('root'))
registerServiceWorker()
