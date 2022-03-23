// @packages
import { ApolloProvider } from '@apollo/client';
import Amplify from 'aws-amplify';

// @scripts
import { apolloClient } from './utility/RealmApolloClient';
import Router from './router/Router';
import AppSyncConfig from './aws-exports';

const App = (props) => {
  Amplify.configure(AppSyncConfig);
  return (
    <ApolloProvider client={apolloClient}>
      <Router>{props.children}</Router>
    </ApolloProvider>
  );
};

export default App;
