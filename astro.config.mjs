// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    allowedHosts: ["nixos.tail6de92.ts.net"],
  },
  compressHTML: true,
  integrations: [svelte()],
  site: "https://gmisail.me",
  base: "/scheduler",
});
