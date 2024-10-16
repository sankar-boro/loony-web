import { createContext, useState, ReactNode } from 'react'
import { AppContextProps, AppState } from 'types'

const AppContext = createContext<AppContextProps>({
  alert: null,
  env: {
    base_url: import.meta.env.VITE_API_URL || undefined,
  },
  setAppContext: () => {
    return
  },
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setAppContext] = useState<AppState>({
    env: {
      base_url: import.meta.env.VITE_API_URL || undefined,
    },
    alert: null,
  })

  return (
    <AppContext.Provider value={{ ...state, setAppContext }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
