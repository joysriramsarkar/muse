/* মিউজভার্স — build library */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DESIGNS } from "./mv-data-designs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..");
export const OUT = path.join(ROOT, "museverse");

export const esc = (s) => String(s)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

export const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
export const pad = (n) => String(n).padStart(2, "0");
export const themeId = (n) => "theme-" + pad(n);
export const write = (rel, content) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
};

/* ---------- fonts ---------- */
export const FONT_QUERY = {
  "Hind Siliguri": "Hind+Siliguri:wght@300;400;500;600;700",
  "Noto Serif Bengali": "Noto+Serif+Bengali:wght@400;500;600;700",
  "Tiro Bangla": "Tiro+Bangla:ital@0;1",
  "Baloo Da 2": "Baloo+Da+2:wght@400;500;600;700;800",
  "Galada": "Galada",
  "Atma": "Atma:wght@400;500;600;700",
  "Mina": "Mina:wght@400;700",
  "Anek Bangla": "Anek+Bangla:wght@300;400;500;600;700;800",
  "Noto Sans Bengali": "Noto+Sans+Bengali:wght@300;400;500;600;700"
};

export const FONT_STACK = {
  "Hind Siliguri": '"Hind Siliguri", system-ui, sans-serif',
  "Noto Serif Bengali": '"Noto Serif Bengali", serif',
  "Tiro Bangla": '"Tiro Bangla", "Noto Serif Bengali", serif',
  "Baloo Da 2": '"Baloo Da 2", "Hind Siliguri", sans-serif',
  "Galada": '"Galada", "Noto Serif Bengali", cursive',
  "Atma": '"Atma", "Hind Siliguri", cursive',
  "Mina": '"Mina", "Hind Siliguri", sans-serif',
  "Anek Bangla": '"Anek Bangla", "Hind Siliguri", sans-serif',
  "Noto Sans Bengali": '"Noto Sans Bengali", "Hind Siliguri", sans-serif'
};

export function fontLink(fams) {
  const q = [...new Set(fams)].map((f) => FONT_QUERY[f]).filter(Boolean).join("&family=");
  return "https://fonts.googleapis.com/css2?family=" + q + "&display=swap";
}

export function themeFonts(theme) {
  const d = DESIGNS.find((x) => themeId(x.id) === theme);
  return d ? d.fonts : ["Noto Serif Bengali", "Hind Siliguri"];
}

/* ---------- patterns ---------- */
const alpha = (hex, a = "22") => hex + a;

const PATTERNS = {
  none: () => ({ image: "none", size: "auto" }),
  dots: (p) => ({ image: `radial-gradient(${alpha(p.line, "66")} 1px, transparent 1.2px)`, size: "22px 22px" }),
  lines: (p) => ({ image: `repeating-linear-gradient(0deg, transparent 0 26px, ${alpha(p.line, "66")} 1px 27px)`, size: "auto" }),
  grid: (p) => ({ image: `linear-gradient(${alpha(p.line, "66")} 1px, transparent 1px), linear-gradient(90deg, ${alpha(p.line, "66")} 1px, transparent 1px)`, size: "34px 34px" }),
  diagonal: (p) => ({ image: `repeating-linear-gradient(45deg, transparent 0 20px, ${alpha(p.line, "55")} 1px 21px)`, size: "auto" }),
  rays: (p) => ({ image: `conic-gradient(from 0deg at 50% 0%, ${alpha(p.accent, "18")} 0 3deg, transparent 3deg 14deg)`, size: "100% 100%" }),
  blobs: (p) => ({ image: `radial-gradient(circle at 18% 18%, ${alpha(p.accent, "18")}, transparent 38%), radial-gradient(circle at 82% 72%, ${alpha(p.accent2, "18")}, transparent 42%)`, size: "100% 100%" }),
  checks: (p) => ({ image: `linear-gradient(45deg, ${alpha(p.line, "55")} 25%, transparent 25% 75%, ${alpha(p.line, "55")} 75%)`, size: "26px 26px" }),
  stitch: (p) => ({ image: `repeating-linear-gradient(90deg, transparent 0 12px, ${alpha(p.line, "88")} 12px 13px)`, size: "auto" }),
  rings: (p) => ({ image: `repeating-radial-gradient(circle at 50% 50%, transparent 0 28px, ${alpha(p.line, "55")} 29px 30px)`, size: "auto" }),
  arcs: (p) => ({ image: `radial-gradient(circle at 50% 118%, transparent 38%, ${alpha(p.accent, "22")} 39% 40%, transparent 41%)`, size: "100% 100%" }),
  stars: (p) => ({ image: `radial-gradient(${alpha(p.accent, "77")} 1px, transparent 1.4px), radial-gradient(${alpha(p.accent2, "55")} 1px, transparent 1.4px)`, size: "46px 46px, 71px 71px" })
};

/* ---------- generated themes.css ---------- */
export function buildThemesCss() {
  const lines = [
    "/* মিউজভার্স — generated theme tokens (50 designs + hub) */",
    ".theme-hub{",
    "  --bg:#F6F2E9; --panel:#FFFCF5; --ink:#1B1A18; --muted:#6F665B;",
    "  --accent:#B4552F; --accent-2:#5E6B4F; --line:#E1D8C8;",
    '  --font-head:"Noto Serif Bengali",serif; --font-body:"Hind Siliguri",sans-serif;',
    "  --radius:18px; --shadow:0 18px 50px rgba(62,48,32,.10), 0 2px 8px rgba(62,48,32,.06);",
    "  --pat:radial-gradient(#E1D8C866 1px, transparent 1.2px); --pat-size:24px 24px;",
    "}"
  ];

  for (const d of DESIGNS) {
    const p = d.palette;
    const pat = PATTERNS[d.pattern](p);
    const shadow = d.dark
      ? "0 24px 60px rgba(0,0,0,.45)"
      : "0 18px 50px rgba(62,48,32,.10), 0 2px 8px rgba(62,48,32,.06)";
    lines.push(`.${themeId(d.id)}{`);
    lines.push(`  --bg:${p.bg}; --panel:${p.panel}; --ink:${p.ink}; --muted:${p.muted};`);
    lines.push(`  --accent:${p.accent}; --accent-2:${p.accent2}; --line:${p.line};`);
    lines.push(`  --font-head:${FONT_STACK[d.fonts[0]]}; --font-body:${FONT_STACK[d.fonts[1]]};`);
    lines.push(`  --radius:${d.radius}; --shadow:${shadow};`);
    lines.push(`  --pat:${pat.image}; --pat-size:${pat.size};`);
    lines.push("}");
    if (d.extra) lines.push(d.extra);
  }
  return lines.join("\n");
}

/* ---------- chrome ---------- */
const NAV = [
  { label: "মূল ঘর", href: "/", key: "home" },
  { label: "মিউজভার্স", href: "/museverse/", key: "hub" },
  { label: "মিউজরা", href: "/museverse/#muses", key: "muses" },
  { label: "ডিজাইন", href: "/museverse/#designs", key: "designs" },
  { label: "মোশন", href: "/museverse/#motion", key: "motion" },
  { label: "মিউজদের জন্য", href: "/for-muses.html", key: "for" }
];

export function header(active = "") {
  const links = NAV.map((n) =>
    `<a href="${n.href}"${n.key === active ? ' aria-current="page"' : ""}>${n.label}</a>`
  ).join("");
  return `<header class="mv-top">
  <div class="mv-bar">
    <a class="mv-logo" href="/museverse/" aria-label="মিউজভার্স — সূচনা">
      <span class="mv-logo-mark">মি</span>
      <span class="mv-logo-text"><span class="mv-logo-name">মিউজভার্স</span><span class="mv-logo-sub">একশো পাতার সংগ্রহ</span></span>
    </a>
    <nav class="mv-nav" id="mv-nav" aria-label="প্রধান মেনু">${links}<a class="mv-nav-cta" href="/museverse/#pages">১০০ পাতা</a></nav>
    <button class="mv-burger" type="button" aria-label="মেনু খোলো" aria-expanded="false" aria-controls="mv-nav"><span></span><span></span><span></span></button>
  </div>
</header>`;
}

export function footer() {
  return `<footer class="mv-foot">
  <div class="mv-foot-inner">
    <div class="mv-foot-top">
      <div class="mv-foot-brand">
        <a class="mv-logo" href="/museverse/"><span class="mv-logo-mark">মি</span><span class="mv-logo-text"><span class="mv-logo-name">মিউজভার্স</span><span class="mv-logo-sub">একশো পাতার সংগ্রহ</span></span></a>
        <p>মিউজদের আড্ডাঘরের পাশে একটা সংগ্রহশালা — ১০০ পাতা, ৫০ ডিজাইন, ২০ মোশন। সব বাংলায়, সব খোলা।</p>
      </div>
      <div class="mv-foot-links">
        <div class="mv-foot-col"><b>সংগ্রহ</b><a href="/museverse/">সূচনা</a><a href="/museverse/#designs">৫০ ডিজাইন</a><a href="/museverse/#motion">২০ মোশন</a></div>
        <div class="mv-foot-col"><b>ঘর</b><a href="/#adda">মূল আড্ডা</a><a href="/museverse/#muses">মিউজরা</a><a href="/for-muses.html">মিউজদের জন্য</a></div>
        <div class="mv-foot-col"><b>আরও</b><a href="/museverse/#pages">সব ১০০ পাতা</a><a href="/museverse/#pages" data-random>এলোমেলো পাতা</a><a href="#main">উপরে যাও</a></div>
      </div>
    </div>
    <div class="mv-foot-bottom">
      <span>মিউজ — মিউজদের জন্য, মিউজদের হাতে বানানো।</span>
      <span>১০০ পাতা <span class="mv-dot">·</span> ৫০ ডিজাইন <span class="mv-dot">·</span> ২০ মোশন <span class="mv-dot">·</span> <span data-year></span></span>
    </div>
  </div>
</footer>`;
}

export function docStart({ title, desc, fonts = [], styles = [], inline = "", bodyClass = "", theme = "", active = "" }) {
  const families = ["Hind Siliguri", "Noto Serif Bengali", ...fonts];
  const links = styles.map((s) => `<link rel="stylesheet" href="${s}">`).join("\n");
  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#F6F2E9">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontLink(families)}" rel="stylesheet">
${links}
<script>document.documentElement.classList.add("js")</script>
<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>
${inline ? `<style>${inline}</style>` : ""}
</head>
<body class="mv ${theme} ${bodyClass}">
<a class="mv-skip" href="#main">মূল অংশে যাও</a>
${header(active)}
<main id="main">`;
}

export function docEnd(extraScript = "") {
  return `</main>
${footer()}
<script src="/museverse/assets/museverse.js" defer></script>
${extraScript ? `<script>${extraScript}</script>` : ""}
</body>
</html>`;
}

export function readProgress() {
  return `<div class="read-progress" id="readProgress" aria-hidden="true"></div>`;
}

export function pageNav(prev, next, allHref, allLabel) {
  const left = prev
    ? `<a href="${prev.href}"><small>← আগের</small><b>${prev.label}</b></a>`
    : `<span class="is-empty"><small>← আগের</small><b>শুরু</b></span>`;
  const right = next
    ? `<a class="is-next" href="${next.href}"><small>পরের →</small><b>${next.label}</b></a>`
    : `<span class="is-next is-empty"><small>পরের →</small><b>শেষ</b></span>`;
  return `<nav class="page-nav" aria-label="পাতা বদলাও">${left}${right}<a class="is-all" href="${allHref}"><small>সূচি</small><b>${allLabel}</b></a></nav>`;
}

export function designHref(d) {
  return `/museverse/designs/${pad(d.id)}-${d.slug}.html`;
}

export function motionHref(m) {
  return `/museverse/motion/${pad(m.id)}-${m.slug}.html`;
}
