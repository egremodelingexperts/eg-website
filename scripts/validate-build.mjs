import fs from "node:fs";
import path from "node:path";

const root = path.resolve("dist");
const htmlFiles = [];
const configuredBase = process.env.DEPLOY_BASE_PATH?.trim() || "/";
const basePath = configuredBase === "/" ? "/" : `/${configuredBase.replace(/^\/+|\/+$/g, "")}/`;

const visit = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(fullPath);
    if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(fullPath);
  }
};

visit(root);

const errors = [];
const remoteAssetPattern = /(?:lh3\.googleusercontent\.com\/aida|static\.wixstatic\.com)/i;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  if (remoteAssetPattern.test(html)) {
    errors.push(`${path.relative(root, file)} contains a remote Stitch or Wix asset URL.`);
  }

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (
      href.startsWith("#") ||
      href.startsWith("http:") ||
      href.startsWith("https:") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      continue;
    }

    const cleanPath = href.split("#")[0].split("?")[0];
    if (!cleanPath.startsWith("/")) continue;

    const buildPath =
      basePath !== "/" && cleanPath.startsWith(basePath)
        ? `/${cleanPath.slice(basePath.length)}`
        : cleanPath;

    const destination =
      buildPath === "/"
        ? path.join(root, "index.html")
        : buildPath.endsWith("/")
          ? path.join(root, buildPath, "index.html")
          : path.join(root, buildPath);

    if (!fs.existsSync(destination)) {
      errors.push(
        `${path.relative(root, file)} links to missing internal destination ${cleanPath}.`,
      );
    }
  }
}

if (errors.length) {
  console.error("Built-site validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files: links and localized assets are clean.`);
