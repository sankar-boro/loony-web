import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from 'react'

/**
 * Building the React Router
 * Create a router context
 * Router context should have two state and one function. States: {location, state}. Function: {navigate}
 * Export functions that links to RouterContext. Exported functions: { Link, Route, Redirect, useParams, useHistory, useNavigate}
 */

interface NodeObject {
  [key: string]: any
}

type RouteState = NodeObject

interface RouterContextProps {
  location: string // Use 'Location' type from 'react-router-dom' for better typing
  navigate: (to: string, state: RouteState) => void // Provide specific function signature
  goBack: () => void // goBack usually doesn't take arguments and returns void
  state: RouteState | null // State can be null
  replaceState: (state: RouteState, title: string, url: string) => void // Provide specific signature for replaceState
}

const RouterContext = createContext<RouterContextProps>({
  location: '',
  navigate: () => {},
  goBack: () => {},
  state: {},
  replaceState: () => {},
})

interface RouteProviderProps {
  children: ReactNode
}

export function BrowserRouter({ children }: RouteProviderProps) {
  const [location, setLocation] = useState(window.location.pathname)
  const [state, setState] = useState({})

  useEffect(() => {
    const handlePopState = () => {
      setLocation(window.location.pathname)
    }

    const handlePageShow = () => {
      return
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  const navigate = (to: string, state: RouteState) => {
    // window.history.pushState(state, '', to);
    setLocation(to)
    setState(state)
  }

  const goBack = () => {
    // window.history.back();
  }

  const replaceState = (state: RouteState, title: string, url: string) => {
    // window.history.replaceState(state, title, url);
    setLocation(url)
    setState(state)
  }

  return (
    <RouterContext.Provider
      value={{
        location,
        navigate,
        goBack,
        state,
        replaceState,
      }}
    >
      {children}
    </RouterContext.Provider>
  )
}

export function Link({
  to,
  state,
  children,
}: {
  to: string
  state: RouteState
  children: ReactNode
}) {
  const { navigate } = useContext(RouterContext)

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault()
    navigate(to, state)
  }

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  )
}

export function Route({
  path,
  component,
}: {
  path: string
  component: React.Component
}) {
  //   const { location } = useContext(RouterContext);
  const match = window.location.pathname === path
  return match ? component : null
}

export function Redirect({ to, state }: { to: string; state: RouteState }) {
  const { navigate } = useContext(RouterContext)

  useEffect(() => {
    navigate(to, state)
  }, [to, navigate])

  return null
}

export function useParams() {
  const { location } = useContext(RouterContext)
  const params: NodeObject = {}

  const match = location.match(/\/:([^/]+)/g)
  if (match) {
    match.forEach(() => {
      // const paramName: string = param.substring(2);
      // params[paramName] = location.params[paramName];
    })
  }

  return params
}

export function useHistory() {
  const { location, state, goBack, replaceState } = useContext(RouterContext)
  return { location, state, goBack, replaceState }
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext)
  return navigate
}
