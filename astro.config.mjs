import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const deploymentBase = process.env.DEPLOY_BASE_PATH?.trim() || "/";

export default defineConfig({
  site: "https://egremodelingexperts.com",
  base: deploymentBase,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    responsiveStyles: true,
  },
});
