import React, { lazy } from 'react'
import { createRoot } from 'react-dom/client'
const Desktop = lazy(() => import('./Desktop.tsx'))
const Mobile = lazy(() => import('./Mobile.tsx'))

const width = window.screen.width

const root = createRoot(document.getElementById('root') as HTMLElement)
if (width <= 760) {
  root.render(
    <React.StrictMode>
      <Mobile />
    </React.StrictMode>
  )
} else {
  root.render(
    <React.StrictMode>
      <Desktop />
    </React.StrictMode>
  )
}
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// const rootEl = document.getElementById('root');
// if (rootEl) {
//   const root = ReactDOM.createRoot(rootEl);
//   root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>,
//   );
// }
