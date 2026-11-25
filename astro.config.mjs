import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const deploymentBase = process.env.DEPLOY_BASE_PATH?.trim() || "/";

export default defineConfig({
  site: "https://egremodelingexperts.com",
  base: deploymentBase,
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      // Keep legacy Wix redirects reachable without advertising them for indexing.
      filter: (page) =>
        !/\/(?:about-us|blank|blank-3|blank-6|blog|contact-us|testamonials|testimonials)\/$/.test(
          new URL(page).pathname,
        ),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    responsiveStyles: true,
  },
});
