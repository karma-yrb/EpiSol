import React, { createContext, useState } from 'react';

// Création du contexte d'authentification
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(1); // ID par défaut pour les tests
  const [userRole, setUserRole] = useState('user'); // Rôle par défaut

  console.log('AuthContext initialized with userId:', userId, 'userRole:', userRole);

  return (
    <AuthContext.Provider value={{ userId, setUserId, userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};
