import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 4000,
    host: true,
    strictPort: true,
    open: true
  },
  preview: {
    port: 4000,
    strictPort: true
  }
});