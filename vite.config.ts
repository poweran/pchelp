import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import cloudflare from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ["pchelp.linkpc.net"],
    port: 4173
  }
});
