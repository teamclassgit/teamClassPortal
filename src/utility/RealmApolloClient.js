import * as Realm from 'realm-web';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloLink } from 'apollo-link';

export const APP_ID = `${process.env.REACT_APP_GQL_APP_ID}`;
const API_KEY = `${process.env.REACT_APP_GQL_API_KEY}`;
const GQL_LOGS = `${process.env.REACT_APP_GQL_API_KEY}`;

//const graphqlUri = `https://realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`
// Local apps should use a local URI!
const graphqlUri = `${process.env.REACT_APP_GQL_URI}${APP_ID}/graphql`;
// const graphqlUri = `https://eu-west-1.aws.stitch.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`
// const graphqlUri = `https://ap-southeast-1.aws.stitch.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`

// Connect to your MongoDB Realm app
export const app = new Realm.App(APP_ID);

// Gets a valid Realm user access token to authenticate requests
async function getValidAccessToken () {
  // Guarantee that there's a logged in user with a valid access token
  if (!app.currentUser) {
    //await loginAnonymous();
  } else {
    // An already logged in user's access token might be stale. To guarantee that the token is
    // valid, we refresh the user's custom data which also refreshes their access token.
    await app.currentUser.refreshCustomData();
  }

  return app.currentUser.accessToken;
}

const omitDeep = (obj, key) => {
  const keys = Object.keys(obj);
  const newObj = {};
  keys.forEach((i) => {
    if (i !== key) {
      const val = obj[i];
      if (val instanceof Date) newObj[i] = val;
      else if (Array.isArray(val)) newObj[i] = omitDeepArrayWalk(val, key);
      else if (typeof val === 'object' && val !== null) newObj[i] = omitDeep(val, key);
      else newObj[i] = val;
    }
  });
  return newObj;
};

/** Code from https://librenepal.com/article/remove-typenames-in-apollo-graphql/
 *  important to avoid __typename when apollo load query results in their memory-cache
 * **/
const omitDeepArrayWalk = (arr, key) => {
  return arr.map((val) => {
    if (Array.isArray(val)) return omitDeepArrayWalk(val, key);
    else if (typeof val === 'object') return omitDeep(val, key);
    return val;
  });
};

const cleanTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables && !operation.variables.file) {
    // eslint-disable-next-line
    operation.variables = omitDeep(operation.variables, '__typename')
  }

  return forward(operation);
});

/****/

const link = new HttpLink({
  uri: graphqlUri,
  // We define a custom fetch handler for the Apollo client that lets us authenticate GraphQL requests.
  // The function intercepts every Apollo HTTP request and adds an Authorization header with a valid
  // access token before sending the request.
  fetch: async (uri, options) => {
    const accessToken = await getValidAccessToken();
    options.headers.Authorization = `Bearer ${accessToken}`;
    return fetch(uri, options);
  }
});

// Configure the ApolloClient to connect to your app's GraphQL endpoint
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([cleanTypenameLink, link]),
  cache: new InMemoryCache()
});

export const loginWithEmailAndPassword = async (email, password) => {
  if (!app) return;
  const credentials = Realm.Credentials.emailPassword(email, password);
  await app.logIn(credentials);
  return app.currentUser;
};

export const loginAnonymous = async () => {
  if (!app) return;
  await app.logIn(Realm.Credentials.anonymous());
  return app.currentUser;
};

export const isAnon = () => {
  return !app || !app.currentUser || !app.currentUser.customData || !app.currentUser.customData.role;
};

export const userData = () => {
  return app && app.currentUser;
};

export const logoutUser = async () => {
  if (!app || !app.currentUser) return;

  await app.currentUser.logOut();
};
