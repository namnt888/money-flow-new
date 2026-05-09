#!/usr/bin/env node

/**
 * Check environment is set up correctly.
 */

const checks = [
  { name: "Node version", cmd: "node --version", required: true },
  { name: "npm version", cmd: "npm --version", required: true },
  { name: "Next.js config", cmd: "test -f next.config.ts", required: true },
  { name: "TypeScript config", cmd: "test -f tsconfig.json", required: true },
  { name: "Tailwind config", cmd: "test -f tailwind.config.ts", required: true },
  { name: "PostCSS config", cmd: "test -f postcss.config.js", required: true },
  { name: "ESLint config", cmd: "test -f eslint.config.js", required: true },
  { name: "Prettier config", cmd: "test -f prettier.config.js", required: true },
  { name: ".env file exists", cmd: "test -f .env", required: false },
];

let allPassed = true;

for (const check of checks) {
  try {
    const result = execSync(check.cmd, { encoding: "utf-8", stdio: "pipe" });
    console.log(`✅ ${check.name}: ${result.trim() || "present"}`);
  } catch {
    if (check.required) {
      console.error(`❌ ${check.name}: missing or failed`);
      allPassed = false;
    } else {
      console.log(`⚠️  ${check.name}: not found (optional)`);
    }
  }
}

process.exit(allPassed ? 0 : 1);

import { execSync } from "child_process";
