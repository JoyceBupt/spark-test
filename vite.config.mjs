import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'load/index': resolve(__dirname, 'load.html'),
        't3d/index': resolve(__dirname, 't3d.html'),
      },
    },
  },
}); 