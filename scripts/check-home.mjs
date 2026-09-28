// Run against a running local dev/production server: node scripts/check-home.mjs
import assert from "node:assert/strict";

const url = process.argv[2] || "http://localhost:3000";
const response = await fetch(url);
assert.equal(response.status, 200, "Homepage must return HTTP 200");
const html = await response.text();
assert.equal(
  [...html.matchAll(/<h1\b/g)].length,
  1,
  "Exactly one main heading",
);

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "No duplicate element IDs");
for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(ids.includes(target), `Anchor #${target} must have a destination`);
}

const labels = [...html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)].map(
  (match) => match[1],
);
const fields = [...html.matchAll(/<(?:input|textarea)\b[^>]*\bid="([^"]+)"/g)];
assert.ok(
  /href="https:\/\/wa\.me\/6285190800168/.test(html),
  "Homepage must offer the configured WhatsApp contact",
);
for (const [, id] of fields)
  assert.ok(labels.includes(id), `Field ${id} needs a linked label`);

const schemas = [
  ...html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
  ),
].map((match) => JSON.parse(match[1]));
assert.ok(
  schemas.some((schema) => schema["@type"] === "FAQPage"),
  "FAQ schema must be present",
);
assert.ok(
  !/<title>[^<]*\| Titik Huni \| Titik Huni<\/title>/.test(html),
  "No duplicate brand in title",
);
console.log(
  "Homepage checks passed: HTTP, heading, anchors, labels, structured data.",
);
