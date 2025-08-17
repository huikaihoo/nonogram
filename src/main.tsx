import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router';

import App from '@/app.tsx';

import '@/index.css';

// biome-ignore lint/style/noNonNullAssertion: hardcode in index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
