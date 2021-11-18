// ** Router Import
import { useState, useEffect } from 'react';
import Router from './router/Router';
import UserContext from './context/UserContext';
// ** Apollo client
import { ApolloProvider } from '@apollo/client';
import { app, apolloClient } from './utility/RealmApolloClient';

const App = (props) => {
  return (
    <ApolloProvider client={apolloClient}>
      <Router />
    </ApolloProvider>
  );
};

export default App;
