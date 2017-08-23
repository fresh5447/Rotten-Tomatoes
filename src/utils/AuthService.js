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

export function login () {
  auth.authorize({
    responseType: 'id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: SCOPE
  })
}

export function logout () {
  clearIdToken()
  clearProfile()
  // browserHistory.push('/') FIX
  window.location = '/'
}

export function requireAuth (nextState, replace) {
  if (!isLoggedIn()) {
    replace({pathname: '/'})
  }
}

export function getIdToken () {
  return localStorage.getItem(ID_TOKEN_KEY)
}

function clearIdToken () {
  localStorage.removeItem(ID_TOKEN_KEY)
}

function clearProfile () {
  localStorage.removeItem('profile')
  localStorage.removeItem('userId')
}

// Helper function that will allow us to extract the id_token
export function getAndStoreParameters () {
  auth.parseHash(window.location.hash, function (err, authResult) {
    if (err) {
      return console.log(err)
    }

    setIdToken(authResult.idToken)
  })
}

export function getEmail () {
  return getProfile().email
}

export function getName () {
  return getProfile().nickname
}

// Get and store id_token in local storage
function setIdToken (idToken) {
  localStorage.setItem(ID_TOKEN_KEY, idToken)
}

export function isLoggedIn () {
  const idToken = getIdToken()
  return !!idToken && !isTokenExpired(idToken)
}

export function getProfile () {
  const token = decode(getIdToken())
  return token
}

function getTokenExpirationDate (encodedToken) {
  const token = decode(encodedToken)
  if (!token.exp) { return null }

  const date = new Date(0)
  date.setUTCSeconds(token.exp)

  return date
}

function isTokenExpired (token) {
  const expirationDate = getTokenExpirationDate(token)
  return expirationDate < new Date()
}
