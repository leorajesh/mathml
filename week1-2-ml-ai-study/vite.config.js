import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset URLs let the same build work at a domain root (Vercel) and under a
  // sub-path such as https://leorajesh.github.io/mathml/ (GitHub Pages). Routing uses the URL hash.
  base: './',
  plugins: [react()],
});
