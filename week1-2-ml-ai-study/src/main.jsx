import React from 'react';
import { createRoot } from 'react-dom/client';
import 'katex/dist/katex.min.css';
// Fonts are bundled with the site (no third-party font requests): Inter for the interface,
// JetBrains Mono for code; math uses KaTeX's own Computer Modern style fonts.
import '@fontsource-variable/inter';
import '@fontsource-variable/geist';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import './styles.css';
import { App } from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
