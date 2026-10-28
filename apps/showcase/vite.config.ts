import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // sis-react is workspace source (TSX), not a published bundle: the dep
  // optimizer produces a broken stub for it, so it stays excluded.
  optimizeDeps: {
    exclude: ["sis-react"],
  },
  server: {
    fs: {
      allow: ["../.."],
    },
  },
});
