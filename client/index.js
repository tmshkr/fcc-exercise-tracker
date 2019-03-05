import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

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

const Main = () => {
  return (
      <ApolloProvider client={client} >
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </ApolloProvider>
    );
}

ReactDOM.render(<Main />, document.getElementById('main'));