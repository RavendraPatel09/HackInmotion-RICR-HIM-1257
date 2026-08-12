import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        issue: resolve(__dirname, 'issue.html'),
        report: resolve(__dirname, 'report.html'),
        track: resolve(__dirname, 'track.html')
      }
    }
  }
});
