import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from './providers/index.tsx';

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>,
);
