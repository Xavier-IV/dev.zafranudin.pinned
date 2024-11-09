import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
  root: path.resolve(__dirname), // Set the root to back_window directory
  build: {
    outDir: path.resolve(__dirname, "../../dist/back_window"), // Output path for the build
    emptyOutDir: true, // Clear the output directory before building
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"), // Entry point
    },
  },
});
