import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    middleware: (app) => {
      app.use((req, res, next) => {
        const mimeTypes = {
          '.mtl': 'model/mtl',
          '.obj': 'model/obj',
          '.glb': 'model/gltf-binary',
          '.gltf': 'model/gltf+json',
          '.fbx': 'application/octet-stream',
          '.dae': 'application/vnd.oipf.dae.svg+xml'
        };

        const extension = req.url.split('.').pop();
        if (mimeTypes[`.${extension}`]) {
          res.setHeader('Content-Type', mimeTypes[`.${extension}`]);
        }
        next();
      });
    }
  }
})