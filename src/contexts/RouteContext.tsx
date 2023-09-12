import React from 'react';
import { UserProvider } from './UserAuthProvider';

export interface AppContextProviderProps {
  children: React.ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  return <UserProvider>{children}</UserProvider>;
};

export default AppContextProvider;
