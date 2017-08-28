import decode from 'jwt-decode'
import auth0 from 'auth0-js'
const ID_TOKEN_KEY = 'id_token'
const CLIENT_ID = process.env.REACT_APP_AUTH_CLIENT_ID
const CLIENT_DOMAIN = process.env.REACT_APP_AUTH_CLIENT_DOMAIN
const REDIRECT = 'http://localhost:3000/callback'
const SCOPE = 'openid email profile'
const AUDIENCE = 'https://rotten-tomatoes.auth0.com/userinfo'

var auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
})

export const login = () => {
  auth.authorize({
    responseType: 'id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: SCOPE
  })
}

export const logout = () => {
  clearIdToken()
  clearProfile()
  // browserHistory.push('/') FIX
  window.location = '/'
}

export const requireAuth = (nextState, replace) => {
  if (!isLoggedIn()) {
    return false
  } else {
    return true
  }
}

export const getIdToken = () => {
  return localStorage.getItem(ID_TOKEN_KEY)
}

const clearIdToken = () => {
  localStorage.removeItem(ID_TOKEN_KEY)
}

const clearProfile = () => {
  localStorage.removeItem('profile')
  localStorage.removeItem('userId')
}

// Helper function that will allow us to extract the id_token
export const getAndStoreParameters = () => {
  auth.parseHash(window.location.hash, function (err, authResult) {
    if (err) {
      return console.log(err)
    }

    setIdToken(authResult.idToken)
  })
}

export const getEmail = () =>
  getProfile().email

export const getName = () =>
  getProfile().nickname

// Get and store id_token in local storage
const setIdToken = (idToken) =>
  localStorage.setItem(ID_TOKEN_KEY, idToken)

export const isLoggedIn = () => {
  const idToken = getIdToken()
  return !!idToken && !isTokenExpired(idToken)
}

export const getProfile = () => {
  const token = decode(getIdToken())
  return token
}

const getTokenExpirationDate = (encodedToken) => {
  const token = decode(encodedToken)
  if (!token.exp) { return null }

  const date = new Date(0)
  date.setUTCSeconds(token.exp)

  return date
}

const isTokenExpired = (token) => {
  const expirationDate = getTokenExpirationDate(token)
  return expirationDate < new Date()
}
