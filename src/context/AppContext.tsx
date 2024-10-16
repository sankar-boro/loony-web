import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export type Alert = null | { status: string, title: string, body: string }
export type AppState = {
  alert: Alert,
  env: {
    base_url: string | undefined,
  }
}

export interface AppContextProps extends AppState {
  setAppContext: Dispatch<SetStateAction<AppState>>;
}

// Initialize context without default values
const AppContext = createContext<AppContextProps>({
  alert: null,
  env: {
    base_url: process.env.API_URL || undefined,
  },
  setAppContext: () => { return; }
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setAppContext] = useState<AppState>({
    env: {
      base_url: process.env.API_URL || undefined
    },
    alert: null,
  });

  return (
    <AppContext.Provider value={{ ...state, setAppContext }}>
      {children}
    </AppContext.Provider>
  );
}


export default AppContext;
