import React, { Component } from 'react';
import UserList from './components/UserList';
import ExerciseList from './components/ExerciseList';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import ApolloClient from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
  typography: {
    useNextVariants: true,
  }
});

const client = new ApolloClient({
  link: new HttpLink(),
  cache: new InMemoryCache()
});


class App extends Component {
  render() {
    return (
      <ApolloProvider client={client} >
        <MuiThemeProvider theme={theme}>
          <UserList />
        </MuiThemeProvider>
      </ApolloProvider>
    );
  }
}

export default App;