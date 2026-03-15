/**
 * Workaround: @noble/hashes v2 uses an exports map that Jest's CJS resolver
 * cannot handle for packages in the sibling web3.js repo.
 *
 * This script downgrades @noble/hashes to 1.8.x inside @theqrl/mldsa87
 * (the only package that pulls v2). Run automatically via npm postinstall.
 *
 * TODO: Remove this script after migrating from Jest to Vitest.
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mldsa87Dir = resolve(
  __dirname,
  "../../web3.js/node_modules/@theqrl/wallet.js/node_modules/@theqrl/mldsa87",
);

if (!existsSync(mldsa87Dir)) {
  process.exit(0);
}

// Check if already on v1.x
const hashesPkg = resolve(
  mldsa87Dir,
  "node_modules/@noble/hashes/package.json",
);
if (existsSync(hashesPkg)) {
  const version = JSON.parse(readFileSync(hashesPkg, "utf8")).version;
  if (version.startsWith("1.")) {
    process.exit(0);
  }
}

console.log(
  "fix-noble-hashes: pinning @noble/hashes@~1.8.0 in @theqrl/mldsa87...",
);
try {
  execSync("npm install @noble/hashes@~1.8.0", {
    cwd: mldsa87Dir,
    stdio: "pipe",
  });
  console.log("fix-noble-hashes: done.");
} catch (err) {
  console.warn("fix-noble-hashes: failed, tests may not work.", err.message);
}
