import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { requireAuth } from '../utils/AuthService'

import Callback from './Callback'
import ListMovie from './ListMovie'
import CreateMovie from './CreateMovie'
import Nav from './Nav'

const Layout = () => (
  <div>
    <Nav />
    <div>
      <Switch>
        <Route exact path='/' component={ListMovie} />

        <Route path='/create' render={() => (
          requireAuth()
            ? <CreateMovie />
            : <Redirect to={{
              pathname: '/'
            }} />
        )} />
        <Route path='/callback' component={Callback} />
      </Switch>
    </div>
  </div>
)

export default Layout
