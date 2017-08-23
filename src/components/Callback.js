import { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { getAndStoreParameters, getIdToken, getEmail, getName } from '../utils/AuthService';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {compose} from 'recompose'

class Callback extends Component {

  componentDidMount() {
    getAndStoreParameters();
    this.createUser();
  }

  createUser = () => {
    const variables = {
      idToken: getIdToken(),
      email: getEmail(),
      name: getName()
    }

    this.props.createUser({ variables })
      .then((response) => {
          console.log("Response from create user", response);
          localStorage.setItem('userId', response.data.createUser.id);
          //FIX
          window.location = '/'
      }).catch((e) => {
        console.error("Error of life ", e)
        //FIX
        window.location = '/'
      })
  }

  render() {
    return null;
  }
}

const createUser = gql`
  mutation ($idToken: String!, $name: String!, $email: String!){
    createUser(authProvider: {auth0: {idToken: $idToken}}, name: $name, email: $email) {
      id
    }
  }
`

const userQuery = gql`
  query {
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

export default enhancer(Callback)
