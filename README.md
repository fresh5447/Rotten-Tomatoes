Please read original tutorial for clarity on web tokens, graph.cool API keys, auth0 API keys.

[Original Tutorial](https://auth0.com/blog/build-a-rottentomatoes-clone-with-graphql-and-auth0/)


You will need to create a `.env` file and account for these credentials:

```
REACT_APP_GRAPH_COOL_URL=*****
REACT_APP_AUTH_CLIENT_ID=*****
REACT_APP_AUTH_CLIENT_DOMAIN=*****
```

Note: App needs to be of type "Regular Web Application" so we can use `HSA256` and Basic Token

Todo: Find out why 🤓

For basic React Router 3 setup, checkout branch `react-router@3`

This branch uses `React Router v4` which requires a slightly different setup.

Our 'Provider' component basically uses Apollos provider and wraps a Layout component.

```
<ApolloProvider client={client}>
  <Router>
    <Layout />
  </Router>
</ApolloProvider>
```

The Layout component is where we actually build our router using the `Switch` method.

We also use router4's nifty redirect component, as opposed to the onEnter prop.

```
<Route path='/create' render={() => (
  requireAuth()
    ? <CreateMovie />
    : <Redirect to={{
      pathname: '/'
    }} />
)} />
```
