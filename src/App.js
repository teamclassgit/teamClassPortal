// @packages
import { ApolloProvider } from '@apollo/client';

// @scripts
import { apolloClient } from './utility/RealmApolloClient';
import Router from './router/Router';
import TwilioClientContextProvider from './context/TwilioContext/TwilioContext';
import { getUserData } from './utility/Utils';

const App = (props) => {
  return (
    <ApolloProvider client={apolloClient}>
      <TwilioClientContextProvider userData={getUserData()?.customData}>
        <Router>{props.children}</Router>
      </TwilioClientContextProvider>
    </ApolloProvider>
  );
};

export default App;
