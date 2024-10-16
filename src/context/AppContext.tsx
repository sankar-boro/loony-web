import { createContext, useState, ReactNode } from 'react'
import { AppContextProps, AppState } from 'loony-types'

import config from '../../config/app.config.json'

const AppContext = createContext<AppContextProps>({
  env: {
    base_url: config.API_URL,
  },
  setAppContext: () => {
    return
  },
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setAppContext] = useState<AppState>({
    env: {
      base_url: config.API_URL,
    },
  })

  return (
    <AppContext.Provider value={{ ...state, setAppContext }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
