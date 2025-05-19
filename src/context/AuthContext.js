import React, { createContext, useState } from 'react';

// Création du contexte d'authentification
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(1); // ID par défaut pour les tests

  console.log('AuthContext initialized with userId:', userId);

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
