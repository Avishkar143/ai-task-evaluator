import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // This forces all libraries to use the SINGLE copy of React in your project
    dedupe: ["react", "react-dom"],
  },
});
