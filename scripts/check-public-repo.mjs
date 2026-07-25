import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);

const errors = [];
const forbiddenPaths = [
  "docs/domain-cutover/private/",
  ".env",
  ".env.local",
  ".env.production",
  ".npmrc",
];

const credentialPatterns = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/],
  ["GitHub fine-grained token", /\bgithub_pat_[A-Za-z0-9_]{20,}\b/],
  ["OpenAI-style secret key", /\bsk-[A-Za-z0-9_-]{20,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{30,}\b/],
];

for (const file of trackedFiles) {
  const normalized = file.split(path.sep).join("/");
  const forbidden = forbiddenPaths.find(
    (entry) => normalized === entry || normalized.startsWith(entry),
  );

  if (forbidden) {
    errors.push(`${normalized}: forbidden private or environment path`);
    continue;
  }

  if (!fs.existsSync(file)) continue;

  const stats = fs.statSync(file);
  if (!stats.isFile() || stats.size > 2_000_000) continue;

  const content = fs.readFileSync(file);
  if (content.includes(0)) continue;

  const text = content.toString("utf8");
  for (const [label, pattern] of credentialPatterns) {
    if (pattern.test(text)) {
      errors.push(`${normalized}: possible ${label}`);
    }
  }
}

if (errors.length) {
  console.error("Public-repository safety check failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log(`Public-repository safety check passed for ${trackedFiles.length} tracked files.`);
