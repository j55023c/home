import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // diferente do site principal, evita conflito rodando os dois juntos
  },
});
