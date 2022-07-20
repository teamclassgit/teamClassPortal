// @packages
import { ApolloProvider } from '@apollo/client';
import Amplify from 'aws-amplify';
// @scripts
import { apolloClient } from './utility/RealmApolloClient';
import Router from './router/Router';
import TwilioClientContextProvider from './context/TwilioContext/TwilioContext';
import { getUserData } from './utility/Utils';
import AppSyncConfig from './aws-exports';

const App = (props) => {
  Amplify.configure(AppSyncConfig);
  return (
    <ApolloProvider client={apolloClient}>
      <TwilioClientContextProvider userData={getUserData()?.customData}>
        <Router>{props.children}</Router>
      </TwilioClientContextProvider>
    </ApolloProvider>
  );
};

export default App;
