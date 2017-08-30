import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router-dom'
import {compose} from 'recompose'
import Auth0Lock from 'auth0-lock'
import { graphql, gql } from 'react-apollo'


// static propTypes = {
//   clientId: PropTypes.string.isRequired,
//   domain: PropTypes.string.isRequired,
//   history: PropTypes.object.isRequired,
// }



class LoginAuth0 extends Component {
  constructor(props) {
    super(props)
    this.lock = new Auth0Lock(this.props.clientId, this.props.domain)
  }


  // Notice the fetch profile from Auth0
  // You can not store the access token in local storage
  // to call later.
  componentDidMount() {
    this.lock.on('authenticated', (authResult) => {
      window.localStorage.setItem('auth0IdToken', authResult.idToken)
      console.log('FIRST PART OF SOME SHIT', authResult)
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          console.error('error authenitcating', error)
          return error
        } else {
          // Once you add a hook that adds a role to a user upon signin
          // it will show up as an additional property app_metadata
          console.log(profile, "HERE IS THE USER PROFILE")
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
    // this.props.data.user || window.localStorage.getItem('auth0IdToken') === null
    // This is the condition in the example ^
    // But if there is a token, doesn't that mean there is a user?
    if(this.props.data.user || window.localStorage.getItem('auth0IdToken') !== null ) {
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



  render() {
    return (
      <div>
        <h3>You Are Not Logged In - You Must Be Logged In </h3>
        <button
          onClick={this.showLogin}
          className='dib pa3 white bg-blue dim pointer'
        >
          Log in with Auth0
        </button>
      </div>
    )
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
export default enhancer(LoginAuth0)
