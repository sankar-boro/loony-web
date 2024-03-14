import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context to store routing information
const RouterContext = createContext();

// Custom Router component
export function BrowserRouter({ children }) {
  const [location, setLocation] = useState(window.location.pathname);
  const [state, setState] = useState({});

  useEffect(() => {
    const handlePopState = () => {
      setLocation(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (to, state) => {
    window.history.pushState({}, '', to);
    setLocation(to);
    setState(state);
  };

  return (
    <RouterContext.Provider value={{ location, navigate, state }}>
      {children}
    </RouterContext.Provider>
  );
}

// Custom Link component
export function Link({ to, children }) {
  const { navigate } = useContext(RouterContext);

  const handleClick = (event) => {
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
}

// Custom Route component
export function Route({ path, component: Component }) {
  const { location } = useContext(RouterContext);

  // Check if the current location matches the route path
  const match = location === path;

  return match ? Component : null;
}

// Custom Redirect component
export function Redirect({ to }) {
  const { navigate } = useContext(RouterContext);

  useEffect(() => {
    navigate(to);
  }, [to, navigate]);

  return null;
}

export function useParams() {
  const { location } = useContext(RouterContext);
  const params = {};

  // Extract parameters from the route path
  const match = location.match(/\/:([^/]+)/g);
  if (match) {
    match.forEach((param) => {
      const paramName = param.substring(2); // Remove leading '/'
      params[paramName] = location.params[paramName];
    });
  }

  return params;
}

export function useHistory() {
  const { location, state } = useContext(RouterContext);
  return { location, state };
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return navigate;
}
