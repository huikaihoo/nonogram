import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router';

import App from '@/app.tsx';
import { ThemeProvider } from '@/components/theme-provider';

import '@/index.css';

// biome-ignore lint/style/noNonNullAssertion: hardcode in index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router basename={import.meta.env.VITE_BASE_URL}>
        <App />
      </Router>
    </ThemeProvider>
  </StrictMode>,
);
