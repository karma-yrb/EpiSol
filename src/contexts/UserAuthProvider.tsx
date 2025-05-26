import React, { ReactNode, createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import isTokenValidMiddleware from '../middlewares/isTokenValidMiddleware';

export interface UserAuthContextType {
  isLoggedIn: boolean;
  tokenData: TokenData | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenData: React.Dispatch<React.SetStateAction<TokenData | null>>;
  isLoading: boolean;
}

interface TokenData {
  userId: string;
  email: string;
  is_admin: boolean;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserAuthContext = createContext<UserAuthContextType>({
  isLoggedIn: false,
  tokenData: null,
  setIsLoggedIn: () => {},
  setTokenData: () => {},
  isLoading: true,
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isTokenValid = isTokenValidMiddleware();
    if (token !== null && isTokenValid) {
      setIsLoading(true);
      setIsLoggedIn(true);
      console.log('token', token);
      const decodedToken = jwtDecode(token) as TokenData;
      setTokenData(decodedToken);
    }
    setIsLoading(false);
  }, [isLoading]);

  return (
    <UserAuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, tokenData, setTokenData, isLoading }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
