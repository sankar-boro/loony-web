import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Building the React Router
 * Create a router context
 * Router context should have two state and one function. States: {location, state}. Function: {navigate}
 * Export functions that links to RouterContext. Exported functions: { Link, Route, Redirect, useParams, useHistory, useNavigate}
 */
const RouterContext = createContext();

export function BrowserRouter({ children }) {
  const [location, setLocation] = useState(window.location.pathname);
  const [state, setState] = useState({});

  useEffect(() => {
    const handlePopState = () => {
      setLocation(window.location.pathname);
    };

    const handlePageShow = () => {
      setState(window.history.state);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const navigate = (to, state) => {
    window.history.pushState(state, '', to);
    setLocation(to);
    setState(state);
  };

  const goBack = () => {
    window.history.back();
  };

  const replaceState = (state, title, url) => {
    window.history.replaceState(state, title, url);
    setLocation(url);
    setState(state);
  };

  return (
    <RouterContext.Provider value={{ location, navigate, goBack, state, replaceState }}>
      {children}
    </RouterContext.Provider>
  );
}

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

export function Route({ path, component: Component }) {
  const { location } = useContext(RouterContext);
  const match = window.location.pathname === path;
  return match ? Component : null;
}

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

  const match = location.match(/\/:([^/]+)/g);
  if (match) {
    match.forEach((param) => {
      const paramName = param.substring(2);
      params[paramName] = location.params[paramName];
    });
  }

  return params;
}

export function useHistory() {
  const { location, state, goBack, replaceState } = useContext(RouterContext);
  return { location, state, goBack, replaceState };
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return navigate;
}
