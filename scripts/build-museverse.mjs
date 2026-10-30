/* মিউজভার্স — build everything
   Run: node scripts/build-museverse.mjs
*/

import fs from "node:fs";
import path from "node:path";
import { buildThemesCss, write, OUT, ROOT, bn } from "./mv-lib.mjs";
import { MUSES, ROOMS, POEMS, STORIES } from "./mv-data-content.mjs";
import { DESIGNS } from "./mv-data-designs.mjs";
import { MOTIONS } from "./mv-build-motions.mjs";
import { buildHub } from "./mv-build-hub.mjs";
import { buildContent } from "./mv-build-content.mjs";
import { buildDesigns } from "./mv-build-designs.mjs";
import { buildMotions } from "./mv-build-motions.mjs";

const pad = (n) => String(n).padStart(2, "0");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function buildManifest() {
  const pages = [];
  pages.push({ cat: "hub", title: "মিউজভার্স", href: "/museverse/", desc: "১০০ পাতার সূচনা" });
  MUSES.forEach((m) => pages.push({ cat: "muses", title: m.name, href: `/museverse/muses/${m.id}.html`, desc: `${m.trait} · ${m.city}` }));
  ROOMS.forEach((r) => pages.push({ cat: "rooms", title: r.name, href: `/museverse/rooms/${r.id}.html`, desc: r.desc }));
  POEMS.forEach((p) => pages.push({ cat: "poems", title: p.title, href: `/museverse/poems/${p.id}.html`, desc: `${p.muse}-এর কবিতা` }));
  STORIES.forEach((s) => pages.push({ cat: "stories", title: s.title, href: `/museverse/stories/${s.id}.html`, desc: `${s.muse}-এর ${s.kind}` }));
  DESIGNS.forEach((d) => pages.push({ cat: "designs", title: d.bn, href: `/museverse/designs/${pad(d.id)}-${d.slug}.html`, desc: `${d.en} — ${d.desc}` }));
  MOTIONS.forEach((m) => pages.push({ cat: "motion", title: m.bn, href: `/museverse/motion/${pad(m.id)}-${m.slug}.html`, desc: `${m.en} — ${m.desc}` }));

  const manifest = {
    title: "মিউজভার্স",
    subtitle: "একশো পাতা, একশো রকম আলো",
    counts: {
      pages: 100, designs: DESIGNS.length, motions: MOTIONS.length,
      muses: MUSES.length, rooms: ROOMS.length, poems: POEMS.length, stories: STORIES.length
    },
    pages
  };
  write("manifest.json", JSON.stringify(manifest, null, 2));
  return pages.length;
}

function checkLinks() {
  const htmlFiles = walk(OUT).filter((f) => f.endsWith(".html"));
  const re = /(?:href|src)="([^"]+)"/g;
  const broken = [];
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    let m;
    while ((m = re.exec(html))) {
      let url = m[1];
      if (!url.startsWith("/") || url.startsWith("//")) continue;
      if (url.startsWith("/api/")) continue;
      url = url.split("#")[0].split("?")[0];
      if (!url) continue;
      let target;
      if (url === "/") target = path.join(ROOT, "index.html");
      else if (url.endsWith("/")) target = path.join(ROOT, url.replace(/^\//, ""), "index.html");
      else target = path.join(ROOT, url.replace(/^\//, ""));
      if (!fs.existsSync(target)) broken.push(`${path.relative(ROOT, file)} → ${m[1]}`);
    }
  }
  return { htmlFiles, broken };
}

console.log("মিউজভার্স — build started");
write("assets/themes.css", buildThemesCss());
console.log("  themes.css");

buildHub();
console.log("  hub");
buildContent();
console.log("  content (muses, rooms, poems, stories)");
buildDesigns();
console.log("  designs");
buildMotions();
console.log("  motions");

const manifestCount = buildManifest();
console.log("  manifest.json");

const { htmlFiles, broken } = checkLinks();
console.log("\nSummary");
console.log("  HTML pages :", htmlFiles.length, "(" + bn(htmlFiles.length) + ")");
console.log("  manifest   :", manifestCount, "entries");
console.log("  designs    :", DESIGNS.length);
console.log("  motions    :", MOTIONS.length);
console.log("  broken     :", broken.length);
if (broken.length) {
  console.error("\nBroken internal links:");
  broken.slice(0, 40).forEach((b) => console.error("  " + b));
  process.exitCode = 1;
}
if (htmlFiles.length !== 100) {
  console.error(`\nExpected exactly 100 HTML pages, found ${htmlFiles.length}.`);
  process.exitCode = 1;
}
