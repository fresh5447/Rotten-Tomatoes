import React, {Component} from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import LoginAuth0 from './LoginAuth0'
import { graphql, gql } from 'react-apollo'
import {compose} from 'recompose'
import ListMovie from './ListMovie'
import CreateMovie from './CreateMovie'
import Nav from './Nav'

const clientId = process.env.REACT_APP_AUTH_CLIENT_ID
const domain = process.env.REACT_APP_AUTH_CLIENT_DOMAIN

class Layout extends Component {
  componentDidMount() {
    console.log('heres your stuff', clientId, domain)
  }

  isLoggedIn = () => {
    console.log("IS LOGGED IN RESULT", this.props.data.user)
    return this.props.data.user
  }

  isLoggedInViaGraphCool = () =>
    this.props.data.user ? true : false

  logout = () => {
    window.localStorage.removeItem('auth0IdToken')
    window.location.reload()
  }

  render () {
    if(this.props.data.loading) {
      return (<div>Loading..</div>)
    } else {
      return (
        <div>
        <h1>{this.isLoggedIn() ? 'Logged In' : 'Logged Out'} </h1>
          <Nav logout={this.logout}  />
          <div>
            <Switch>
              <Route exact path='/' component={ListMovie} />
              <Route exact path='/login' render={() => (
                <LoginAuth0
                        clientId={clientId}
                        domain={domain}
                      />
              )} />
              <Route exact path='/create-movie' render={() => (
                this.isLoggedIn()
                ? <CreateMovie />
                : <LoginAuth0
                        clientId={clientId}
                        domain={domain}
                      />
              )} />
            </Switch>
          </div>
        </div>
      )
    }
  }

}

const userQuery = gql`
  query userQuery {
    user {
      id
    }
  }
`

const enhancer = compose(
  graphql(userQuery, { options: { fetchPolicy: 'network-only' }}),
  withRouter
)
export default enhancer(Layout)
