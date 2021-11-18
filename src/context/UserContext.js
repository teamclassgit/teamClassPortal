import React from 'react';

const UserContext = React.createContext({
  app: null,
  client: null,
  user: null,
  setClient: () => {},
  setUser: () => {}
});

export default UserContext;
