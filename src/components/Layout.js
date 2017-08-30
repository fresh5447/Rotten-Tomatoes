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

  // Both the below functions work equally well at knowing if there is a user logged in
  isLoggedInViaGraphCool = () => {
    console.log("DOES GRAPH COOL THINK WE ARE LOGGED IN?", this.props.data.user)
    return this.props.data.user ? true : false
  }

  isLoggedInViaJustLocallyStoredToken = () => {
    const tokenResult = window.localStorage.getItem('auth0IdToken') === null ? false : true
    console.log("DOES LOCAL STORAGE THINK WE ARE LOGGED IN?", tokenResult)
    return tokenResult
  }



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
          <Nav logout={this.logout}  />
          <div>
            <Switch>
              <Route exact path='/' component={() => (
                <div>
                  <h4> Home Page </h4>
                </div>
              )} />
              <Route exact path='/movie-list' component={ListMovie} />
              <Route exact path='/login' render={() => (
                <LoginAuth0
                  clientId={clientId}
                  domain={domain}
                />
              )} />
              <Route exact path='/create-movie' render={() => (
                this.isLoggedInViaGraphCool()
                ? <CreateMovie />
                : <LoginAuth0
                        clientId={clientId}
                        domain={domain}
                      />
              )} />
              <Route exact path='/test-route' render={() => (
                this.isLoggedInViaJustLocallyStoredToken()
                ? <h1>Congrats, you are logged in </h1>
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
