import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg: {
        quality: 75,
      },
      jpeg: {
        quality: 75,
      },
      png: {
        quality: 75,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split heavy editor dependencies into separate chunks
          if (id.includes('grapesjs') || id.includes('@craftjs') || id.includes('react-moveable')) {
            return 'editor-libs';
          }
          // Split React Query
          if (id.includes('@tanstack/react-query')) {
            return 'react-query';
          }
          // Split Radix UI by component groups
          if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-dropdown-menu') || id.includes('@radix-ui/react-popover')) {
            return 'ui-overlays';
          }
          if (id.includes('@radix-ui')) {
            return 'ui-libs';
          }
          // Split form libraries
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
            return 'form-libs';
          }
          // Split Appwrite
          if (id.includes('appwrite')) {
            return 'appwrite';
          }
          // Split other vendor code
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
}));
