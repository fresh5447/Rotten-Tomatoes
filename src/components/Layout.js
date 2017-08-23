import React from 'react'
import { Route, Switch } from 'react-router-dom'
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
        <Route path='/create' component={CreateMovie} onEnter={requireAuth} />
        <Route path='/callback' component={Callback} />
      </Switch>
    </div>
  </div>
)

export default Layout
