// @packages
import { ApolloProvider } from '@apollo/client';

// @scripts
import { apolloClient } from './utility/RealmApolloClient';
import Router from './router/Router';

const App = (props) => {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        {props.children}
      </Router>
    </ApolloProvider>
  );
};

export default App;
