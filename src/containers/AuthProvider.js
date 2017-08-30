// This File is basically garbage

import React, {Component} from 'react'
import Auth0Lock from 'auth0-lock'
import { graphql, gql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import {compose} from 'recompose'


const clientId = process.env.REACT_APP_AUTH_CLIENT_ID
const domain = process.env.REACT_APP_AUTH_CLIENT_DOMAIN

const providerHOC = (WrappedComponent) => {
  return class Auth0DataProvider extends Component {
    componentDidMount () {
      this.lock.on('authenticated', (authResult) => {
        window.localStorage.setItem('auth0IdToken', authResult.idToken)
        this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
          if (error) {
            console.error('error authenitcating', error)
          } else {
            this.initiateCreateUser(authResult.idToken, profile)
          }
        })
      })
    }

    showLogin = () => {
      this.lock.show()
    }

    initiateCreateUser = (token, profile) => {
      // redirect if user is logged in or did not finish Auth0 Lock dialog
      if(this.props.data.user || window.localStorage.getItem('auth0IdToken')) {
        alert("not a new user")
        this.props.history.replace('/')
      } else {
        // In the Database graphcool knows the Auth0 ID
        // which looks like this: auth0|59a5dee6f453001022dc08ae
        // which is interesteing because we are not explicitly
        // passing it down.
        const variables = {
          idToken: token,
          emailAddress: profile.email,
          name: profile.name,
        }

        this.props.createUser({ variables })
          .then((response) => {
              alert("Successfully created a new user")
              this.props.history.replace('/')
          }).catch((e) => {
            console.error(e)
            this.props.history.replace('/')
          })

      }
    }

    render () {
      const someTest = 'Hello World'
      return (
        <WrappedComponent {...this.props} someTest={someTest} />
      )
    }
  }
}

const createUser = gql`
  mutation ($idToken: String!, $name: String!, $emailAddress: String!){
    createUser(authProvider: {auth0: {idToken: $idToken}}, name: $name, emailAddress: $emailAddress) {
      id
    }
  }
`

const userQuery = gql`
  query userQuery {
    user {
      id
    }
  }
`

const enhancer = compose(
  graphql(createUser, {name: 'createUser'}),
  graphql(userQuery, { options: { fetchPolicy: 'network-only' }}),
  withRouter
)
export default enhancer(providerHOC)
