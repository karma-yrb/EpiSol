import React, { createContext } from 'react';

// Ce contexte est désormais un simple placeholder pour compatibilité éventuelle
export const UserAuthContext = createContext({});

export const UserProvider = ({ children }) => {
  return (
    <UserAuthContext.Provider value={{}}>
      {children}
    </UserAuthContext.Provider>
  );
};
