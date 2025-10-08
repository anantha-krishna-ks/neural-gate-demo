import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  return {
    server: isDev
      ? {
          host: "::",
          port: 8080,
          cors: {
            origin: true,
            credentials: true,
          },
          // Dev-only proxy. In production, your app will call the absolute API URL directly.
          proxy: {
            '/api': {
              target: 'https://ai.excelsoftcorp.com',
              changeOrigin: true,
              secure: false,
              rewrite: (p) => p.replace(/^\/api/, '/ai-apps/api'),
            },
          },
        }
      : {
          host: "::",
          port: 8080,
          cors: {
            origin: true,
            credentials: true,
          },
        },
    plugins: [
      react(),
      isDev && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
});
