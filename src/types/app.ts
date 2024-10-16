import { AuthContextProps } from './user'

export type Alert = null | { status: string; title: string; body: string }
export type AppState = {
  alert: Alert
  env: {
    base_url: string
  }
}

export interface AppContextProps extends AppState {
  setAppContext: React.Dispatch<React.SetStateAction<AppState>>
}



export type AppRouteProps = { 
    setMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>, 
    mobileNavOpen: boolean, 
    isMobile: boolean, 
    authContext: AuthContextProps,
    appContext: AppContextProps
}