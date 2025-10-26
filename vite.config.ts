import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      configPath: "./wrangler.json"
    })
  ],
  server: {
    host: true,
    allowedHosts: ["pchelp.linkpc.net"],
    port: 4173
  }
});
