import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Lumenary Lingua is deployed as a fully static site (no application server), so it can be hosted
// cheaply on any static host or CDN without vendor lock-in.

// @lumenary/core ships TypeScript source, which Next compiles. While it is linked from a sibling
// checkout ("file:../lumenary-core"), its real path is outside this project, and Turbopack reads
// files outside the project root only from roots it is told about.
const core = fs.realpathSync(path.join(process.cwd(), "node_modules/@lumenary/core"));
const linked = path.relative(process.cwd(), core).startsWith("..");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  transpilePackages: ["@lumenary/core"],
  experimental: {
    // A styled 404.html for every unknown address (the site has two root layouts: / and /[locale]/).
    globalNotFound: true,
    ...(linked ? { turbopackAdditionalRoots: { "lumenary-core": { path: core } } } : {}),
  },
};

export default nextConfig;
