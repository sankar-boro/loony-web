import React, { createContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, setAppState] = useState({});

  return <AppContext.Provider value={{ state, setAppState }}>{children}</AppContext.Provider>;
}
