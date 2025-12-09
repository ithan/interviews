// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import nodeFastify from "astro-node-fastify";
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: nodeFastify({
    // Enable compression for both assets and SSR responses
    
    assetCompression: {
      fileExtensions: [".css", ".js", ".html", ".xml", ".cjs", ".mjs", ".svg", ".txt", ".json"],
      threshold: 1024,
    },
    cache: {
      maxAge: 604800, // 7 days for static assets
      staleWhileRevalidate: 86400, // 24 hours
    },
  }),
  compressHTML: true,
  security: {
    checkOrigin: true, // This should be enabled by default in SSR mode
  },
  experimental: {
    csp: false
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
  output: "server",
});

