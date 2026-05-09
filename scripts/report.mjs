#!/usr/bin/env node

/**
 * Task report generator.
 * Run this after completing any task: node scripts/report.mjs
 * It scans git status and compiles a report.
 */

import { execSync } from "child_process";

const bold = (s) => `\x1b[1m${s}\x1b[0m`;

try {
  const status = execSync("git status --short").toString().trim();
  const log = execSync("git log --oneline -5").toString().trim();
  const branch = execSync("git branch --show-current").toString().trim();

  console.log(`\n${bold("=== Task Report ===")}\n`);
  console.log(`Branch: ${branch}`);
  console.log(`\n${bold("Recent commits:")}\n${log}`);

  if (status) {
    console.log(`\n${bold("Changed files:")}\n${status}`);
  } else {
    console.log(`\nNo uncommitted changes.`);
  }

  const total = status ? status.split("\n").length : 0;
  console.log(`\n${bold("Summary:")} ${total} file(s) changed`);
  console.log("\n---");
  console.log("Always produce this report after finishing a task.\n");
} catch (e) {
  console.error("Error generating report:", e.message);
}
