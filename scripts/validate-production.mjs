import fs from "node:fs";

const siteConfig = fs.readFileSync(new URL("../src/config/site.ts", import.meta.url), "utf8");
const privacyPage = fs.readFileSync(
  new URL("../src/pages/privacy/index.astro", import.meta.url),
  "utf8",
);

const errors = [];

if (siteConfig.includes("FORM_URL_PENDING") || /embedUrl:\s*""/.test(siteConfig)) {
  errors.push("Consultation Google Form URLs are still pending.");
}

if (privacyPage.includes("PRIVACY_COPY_PENDING")) {
  errors.push("Approved privacy policy copy is still pending.");
}

if (errors.length) {
  console.error("Production validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Production content validation passed.");
