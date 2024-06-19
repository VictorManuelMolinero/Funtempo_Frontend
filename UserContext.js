import React, { createContext, useState } from 'react';

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, email, setEmail, password, setPassword }}>
      {children}
    </UserContext.Provider>
  );
};
