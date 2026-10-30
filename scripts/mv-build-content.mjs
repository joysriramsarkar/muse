/* মিউজভার্স — build content pages (muses, rooms, poems, stories) */

import { MUSES, ROOMS, POEMS, STORIES } from "./mv-data-content.mjs";
import { DESIGNS } from "./mv-data-designs.mjs";
import {
  esc, bn, pad, themeId, themeFonts, docStart, docEnd, pageNav,
  readProgress, designHref, write
} from "./mv-lib.mjs";

const museByName = Object.fromEntries(MUSES.map((m) => [m.name, m]));
const museById = Object.fromEntries(MUSES.map((m) => [m.id, m]));

const museHref = (m) => `/museverse/muses/${m.id}.html`;
const roomHref = (r) => `/museverse/rooms/${r.id}.html`;
const poemHref = (p) => `/museverse/poems/${p.id}.html`;
const storyHref = (s) => `/museverse/stories/${s.id}.html`;

const designForTheme = (theme) => DESIGNS.find((d) => themeId(d.id) === theme);

function wrapPage({ title, desc, theme, fonts, content, active = "muses", bodyClass = "content-page", extra = "" }) {
  return docStart({
    title, desc, theme, fonts: fonts || themeFonts(theme),
    styles: ["/museverse/assets/base.css", "/museverse/assets/themes.css"],
    bodyClass, active
  }) + content + docEnd(extra);
}

/* ---------------- muse pages ---------------- */
function buildMuse(m, idx) {
  const prev = MUSES[(idx - 1 + MUSES.length) % MUSES.length];
  const next = MUSES[(idx + 1) % MUSES.length];
  const poem = POEMS.find((p) => p.muse === m.name);
  const story = STORIES.find((s) => s.muse === m.name);
  const room = ROOMS.find((r) => r.muse === m.name);
  const design = designForTheme(m.theme);

  const chat = m.chat.map(([who, text]) => who === "me"
    ? `<div class="chat-line me"><div class="chat-ava">তু</div><div class="chat-bubble">${esc(text)}</div></div>`
    : `<div class="chat-line"><div class="chat-ava">${m.initial}</div><div class="chat-bubble">${esc(text)}</div></div>`
  ).join("");

  const loves = m.loves.map((x) => `<div class="muse-fact"><small>প্রিয়</small><b>${esc(x)}</b></div>`).join("");

  const links = [
    room && ["ঘর", room.name, roomHref(room), "এই মিউজের প্রিয় ঘরে বসো"],
    poem && ["কবিতা", poem.title, poemHref(poem), "এই মিউজের একটা কবিতা"],
    story && ["গল্প", story.title, storyHref(story), "এই মিউজের একটা গল্প"],
    design && ["ডিজাইন", design.bn, designHref(design), "এই মিউজের থিম"]
  ].filter(Boolean).map(([tag, label, href, note]) =>
    `<a class="muse-link" href="${href}"><span><small style="display:block;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted)">${tag}</small><b style="font-family:var(--font-head);font-size:16px">${label}</b><small style="display:block;color:var(--muted);font-size:12.5px">${note}</small></span><b>→</b></a>`
  ).join("");

  const content = `<div class="content-shell">
  <header class="content-hero muse-hero">
    <div class="muse-avatar">${m.initial}</div>
    <div>
      <span class="mv-eyebrow">মিউজ · ${pad(idx + 1)}</span>
      <h1>${m.name}</h1>
      <div class="muse-trait">${m.trait} · ${m.city}</div>
      <p class="muse-bio">${m.intro}</p>
      <div class="mv-row mv-mt">
        <a class="mv-btn mv-btn-arrow" href="/?muse=${m.id}#adda">${m.name}-কে ডাকো</a>
        <a class="mv-btn mv-btn-ghost" href="/museverse/#muses">সব মিউজ</a>
      </div>
    </div>
  </header>

  <div class="content-body">
    <h2>${m.name} কে?</h2>
    <p>${m.bio}</p>
    <blockquote>“${m.quote}”</blockquote>

    <h2>যা ভালোবাসে</h2>
    <div class="muse-facts">${loves}</div>

    <h2>${m.name}-এর সঙ্গে একটু আড্ডা</h2>
    <div class="muse-chat">${chat}</div>

    <h2>আরও পড়ো</h2>
    <div class="muse-links">${links}</div>
  </div>

  ${pageNav(
    { href: museHref(prev), label: prev.name },
    { href: museHref(next), label: next.name },
    "/museverse/#muses",
    "সব মিউজ"
  )}
</div>`;

  const html = wrapPage({
    title: `${m.name} — ${m.trait} · মিউজভার্স`,
    desc: `${m.name}, ${m.city} থেকে — ${m.trait}। ${m.intro}`,
    theme: m.theme,
    content,
    active: "muses"
  });
  write(`muses/${m.id}.html`, html);
  return html;
}

/* ---------------- room pages ---------------- */
function buildRoom(r, idx) {
  const prev = ROOMS[(idx - 1 + ROOMS.length) % ROOMS.length];
  const next = ROOMS[(idx + 1) % ROOMS.length];
  const muse = museByName[r.muse];
  const poem = POEMS.find((p) => p.muse === r.muse);

  const prompts = r.prompts.map((p) =>
    `<a href="/?muse=${muse ? muse.id : ""}#adda">${esc(p)}</a>`
  ).join("");
  const rules = r.rules.map((x) => `<li>${esc(x)}</li>`).join("");
  const preview = r.preview.map(([who, text]) =>
    `<div class="chat-line"><div class="chat-ava">${who[0]}</div><div class="chat-bubble"><b style="display:block;font-size:11px;color:var(--accent);margin-bottom:2px">${who}</b>${esc(text)}</div></div>`
  ).join("");

  const content = `<div class="content-shell">
  <header class="content-hero room-hero">
    <div class="room-door" aria-hidden="true"></div>
    <span class="mv-eyebrow">${r.eyebrow}</span>
    <h1>${r.name}</h1>
    <p class="mv-lead">${r.desc}</p>
    <div class="mv-row mv-mt">
      <a class="mv-btn mv-btn-arrow" href="/#adda">এই ঘরে বসো</a>
      ${muse ? `<a class="mv-btn mv-btn-ghost" href="${museHref(muse)}">${muse.name}-কে দেখো</a>` : ""}
    </div>
  </header>

  <div class="content-body">
    <p>${r.long}</p>
    <h2>এই ঘরে কী নিয়ে কথা হয়</h2>
    <div class="room-prompts">${prompts}</div>

    <div class="room-grid">
      <div class="room-preview">
        <h3>ঘরের একটা টুকরো</h3>
        ${preview}
      </div>
      <div>
        <h2 style="margin-top:0">ঘরের নিয়ম</h2>
        <ul class="room-rules">${rules}</ul>
      </div>
    </div>

    <h2>আরও</h2>
    <div class="muse-links">
      ${muse ? `<a class="muse-link" href="${museHref(muse)}"><span><small style="display:block;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted)">ঘরের মিউজ</small><b style="font-family:var(--font-head);font-size:16px">${muse.name}</b><small style="display:block;color:var(--muted);font-size:12.5px">${muse.trait}</small></span><b>→</b></a>` : ""}
      ${poem ? `<a class="muse-link" href="${poemHref(poem)}"><span><small style="display:block;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted)">কবিতা</small><b style="font-family:var(--font-head);font-size:16px">${poem.title}</b><small style="display:block;color:var(--muted);font-size:12.5px">${poem.muse}-এর লেখা</small></span><b>→</b></a>` : ""}
    </div>
  </div>

  ${pageNav(
    { href: roomHref(prev), label: prev.name },
    { href: roomHref(next), label: next.name },
    "/museverse/#pages",
    "সব ঘর"
  )}
</div>`;

  const html = wrapPage({
    title: `${r.name} — মিউজভার্সের ঘর`,
    desc: `${r.desc} ${r.long}`,
    theme: r.theme,
    content,
    active: "hub"
  });
  write(`rooms/${r.id}.html`, html);
  return html;
}

/* ---------------- poem pages ---------------- */
function buildPoem(p, idx) {
  const prev = POEMS[(idx - 1 + POEMS.length) % POEMS.length];
  const next = POEMS[(idx + 1) % POEMS.length];
  const muse = museByName[p.muse];
  const design = designForTheme(p.theme);
  const stanzas = p.stanzas.map((st) => `<p>${esc(st).replace(/\n/g, "<br>")}</p>`).join("");

  const content = `${readProgress()}
<div class="poem-shell">
  <header class="poem-head">
    <span class="mv-eyebrow">কবিতা · ${pad(idx + 1)}</span>
    <h1>${p.title}</h1>
    <p class="poem-byline">${p.muse} · ${muse ? muse.city : "মিউজভার্স"}</p>
  </header>
  <div class="poem-body">${stanzas}</div>
  <div class="poem-note">${p.note}</div>
  <div class="poem-foot">
    ${muse ? `<a class="mv-tag is-accent" href="${museHref(muse)}">${muse.name}</a>` : ""}
    <span class="mv-tag">${p.theme.replace("theme-", "থিম ")}</span>
    ${design ? `<a class="mv-tag" href="${designHref(design)}">এই পাতার ডিজাইন · ${design.bn}</a>` : ""}
  </div>
  ${pageNav(
    { href: poemHref(prev), label: prev.title },
    { href: poemHref(next), label: next.title },
    "/museverse/#pages",
    "সব কবিতা"
  )}
</div>`;

  const html = wrapPage({
    title: `${p.title} — ${p.muse}-এর কবিতা · মিউজভার্স`,
    desc: `${p.title}, ${p.muse}-এর লেখা একটি বাংলা কবিতা। ${p.note}`,
    theme: p.theme,
    content,
    active: "hub",
    bodyClass: "content-page poem-page"
  });
  write(`poems/${p.id}.html`, html);
  return html;
}

/* ---------------- story pages ---------------- */
function buildStory(s, idx) {
  const prev = STORIES[(idx - 1 + STORIES.length) % STORIES.length];
  const next = STORIES[(idx + 1) % STORIES.length];
  const muse = museByName[s.muse];
  const design = designForTheme(s.theme);
  const paras = s.paragraphs.map((x) => `<p>${esc(x)}</p>`).join("");

  const content = `${readProgress()}
<div class="story-shell">
  <header class="story-head">
    <span class="mv-eyebrow">${s.kind} · ${pad(idx + 1)}</span>
    <h1>${s.title}</h1>
    <p class="poem-byline">${s.muse} · ${muse ? muse.city : "মিউজভার্স"}</p>
  </header>
  <div class="story-body">${paras}</div>
  <div class="story-sign">${s.sign}</div>
  <div class="poem-foot">
    ${muse ? `<a class="mv-tag is-accent" href="${museHref(muse)}">${muse.name}</a>` : ""}
    <span class="mv-tag">${s.kind}</span>
    ${design ? `<a class="mv-tag" href="${designHref(design)}">এই পাতার ডিজাইন · ${design.bn}</a>` : ""}
  </div>
  ${pageNav(
    { href: storyHref(prev), label: prev.title },
    { href: storyHref(next), label: next.title },
    "/museverse/#pages",
    "সব গল্প"
  )}
</div>`;

  const html = wrapPage({
    title: `${s.title} — ${s.kind} · মিউজভার্স`,
    desc: `${s.title}, ${s.muse}-এর ${s.kind}। মিউজদের আড্ডাঘরের সংগ্রহ থেকে।`,
    theme: s.theme,
    content,
    active: "hub",
    bodyClass: "content-page story-page"
  });
  write(`stories/${s.id}.html`, html);
  return html;
}

export function buildContent() {
  MUSES.forEach(buildMuse);
  ROOMS.forEach(buildRoom);
  POEMS.forEach(buildPoem);
  STORIES.forEach(buildStory);
  return 6 + 8 + 8 + 7;
}

export { museHref, roomHref, poemHref, storyHref };
