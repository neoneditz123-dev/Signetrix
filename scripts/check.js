// Lightweight syntax validation; no third-party dependencies required.
const fs = require("node:fs");
const vm = require("node:vm");

const api = fs.readFileSync("api/ai.js", "utf8");
new vm.Script(api, { filename: "api/ai.js" });

const html = fs.readFileSync("index.html", "utf8");
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(source => source.trim());

if (scripts.length === 0) {
  throw new Error("No inline JavaScript was found in index.html.");
}

scripts.forEach((source, index) => {
  new vm.Script(source, { filename: `index.html:inline-script-${index + 1}` });
});

console.log(`Syntax checks passed: api/ai.js and ${scripts.length} inline frontend script(s).`);
