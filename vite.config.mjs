import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'spark/index': resolve(__dirname, 'spark.html'),
        't3d/index': resolve(__dirname, 't3d.html'),
        'mkkellogg/index': resolve(__dirname, 'mkkellogg.html'),
        'playcanvas/index': resolve(__dirname, 'playcanvas.html'),
      },
    },
  },
  plugins: [
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ],
}); 