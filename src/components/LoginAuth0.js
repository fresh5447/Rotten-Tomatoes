import React, { Component, PropTypes } from 'react'
import Auth0Lock from 'auth0-lock'
import { withRouter } from 'react-router-dom'
import {compose} from 'recompose'
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


  componentDidMount() {
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
    if(this.props.data.user || window.localStorage.getItem('auth0IdToken') === null) {
      alert("not a new user")
      return
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
  graphql(userQuery, { options: { fetchPolicy: 'network-only' }}),
  graphql(createUser, {name: 'createUser'}),
  withRouter
)
export default enhancer(LoginAuth0)
