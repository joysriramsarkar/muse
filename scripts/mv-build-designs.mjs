/* মিউজভার্স — build 50 design specimen pages */

import { DESIGNS } from "./mv-data-designs.mjs";
import {
  esc, bn, pad, themeId, write, themeFonts,
  docStart, docEnd, designHref
} from "./mv-lib.mjs";

const LAYOUT_NOTES = {
  editorial: "প্রশস্ত শিরোনাম আর পাশের আর্ট ব্লক চোখকে দুই গতিতে চালায় — পড়া আর দেখা একসঙ্গে।",
  split: "দুই সমান অর্ধেক: একদিকে কথা, অন্যদিকে রং। তুলনার জন্য সহজ।",
  centered: "সবকিছু মাঝখানে — শান্ত, আত্মবিশ্বাসী, কম কথা বলার ভঙ্গি।",
  poster: "বড় টাইপোগ্রাফি দেয়ালের পোস্টারের মতো; এক নজরে একটাই বার্তা।",
  sidebar: "পাশের রেল স্থির থাকে, মূল অংশ চলতে থাকে — দীর্ঘ পড়ার জন্য।",
  magazine: "অসম গ্রিড, ওভারল্যাপ, আর বড় শিরোনাম — পাতা উল্টানোর আনন্দ।",
  terminal: "মনোস্পেস, উইন্ডো-ক্রোম, আর কমান্ড-লাইন মেজাজ।",
  gallery: "আর্ট ব্লকটা টাইল-গ্রিড হয়ে যায়; রং আর আকৃতিই গল্প বলে।",
  timeline: "উল্লম্ব রেখা আর বিন্দু — সময়ের ক্রম বোঝায়।",
  card: "পুরো হিরো একটা বড় কার্ডের ভেতরে — সংগ্রহযোগ্য, ছবির মতো।"
};

const PATTERN_NOTES = {
  none: "ব্যাকগ্রাউন্ড পরিষ্কার; মনোযোগ শুধু টাইপোগ্রাফি আর রঙে।",
  dots: "ছোট বিন্দু কাগজকে কাপড়ের মতো টেক্সচার দেয়।",
  lines: "অনুভূমিক রেখা খাতার মতো ছন্দ আনে।",
  grid: "গ্রিড দেখায় যে লেআউটের পেছনে হিসাব আছে।",
  diagonal: "তির্যক রেখা গতি আর শহুরে কোলাহল বোঝায়।",
  rays: "কেন্দ্র থেকে ছড়ানো রশ্মি উৎসব বা আলোর অনুভূতি।",
  blobs: "নরম রঙিন ছোপ কাগজকে শ্বাস নিতে দেয়।",
  checks: "চেকার প্যাটার্ন হাতে বোনা কাপড়ের স্মৃতি।",
  stitch: "সেলাইয়ের মতো ড্যাশ — কাঁথা বা নকশির ছোঁয়া।",
  rings: "বৃত্তের পুনরাবৃত্তি মণ্ডল বা আলপনার মতো।",
  arcs: "বাঁকা রেখা নদী, ঢেউ, বা পাহাড়ের দিকে ইশারা করে।",
  stars: "ছোট আলোর বিন্দু রাতের আকাশের কথা বলে।"
};

const CHAT_POOL = [
  ["মেঘ", "বৃষ্টির শব্দটা আজ অন্যদিনের মতো।"],
  ["তিতির", "আমার বাগটা আজ গল্প বলছে।"],
  ["রুদ্র", "পুরনো রেললাইনের পাশে একটা নাম খুঁজে পেলাম।"],
  ["শারদ", "চা তৈরি, গল্পের অপেক্ষা।"],
  ["নীল", "আকাশ আজ পরিষ্কার, প্রশ্নগুলোও।"],
  ["বন্যা", "ট্রেনের জানালা থেকে শহরটা ছোট দেখাচ্ছে।"]
];

function designNotes(d) {
  const p = d.palette;
  return [
    { b: "রঙের গল্প", p: `${p.accent} আর ${p.accent2} — একটান গরম, একটা ঠান্ডা; দুটো মিলে একটা ভারসাম্য বানায়।` },
    { b: "টাইপোগ্রাফি", p: `${d.fonts[0]} শিরোনামে, ${d.fonts[1]} বডিতে। দুই ফন্টের ওজন আলাদা, তাই পড়া সহজ।` },
    { b: "লেআউট", p: LAYOUT_NOTES[d.layout] || "গ্রিড আর ফাঁকা জায়গা মিলে পড়ার ছন্দ তৈরি করে।" },
    { b: "টেক্সচার", p: PATTERN_NOTES[d.pattern] || "ব্যাকগ্রাউন্ড হালকা, যাতে লেখা শ্বাস নিতে পারে।" }
  ];
}

function tokenCss(d) {
  const p = d.palette;
  return [
    `--bg: ${p.bg};`,
    `--panel: ${p.panel};`,
    `--ink: ${p.ink};`,
    `--muted: ${p.muted};`,
    `--accent: ${p.accent};`,
    `--accent-2: ${p.accent2};`,
    `--line: ${p.line};`,
    `--font-head: "${d.fonts[0]}";`,
    `--font-body: "${d.fonts[1]}";`,
    `--radius: ${d.radius};`
  ].join("\n");
}

function buildDesignPage(d) {
  const idx = DESIGNS.findIndex((x) => x.id === d.id);
  const prev = DESIGNS[(idx - 1 + DESIGNS.length) % DESIGNS.length];
  const next = DESIGNS[(idx + 1) % DESIGNS.length];
  const p = d.palette;
  const notes = designNotes(d);
  const chat = [0, 1, 2].map((n) => CHAT_POOL[(d.id + n) % CHAT_POOL.length]);

  const swatches = [
    ["কাগজ", p.bg],
    ["প্যানেল", p.panel],
    ["কালি", p.ink],
    ["মিউট", p.muted],
    ["অ্যাকসেন্ট", p.accent],
    ["দ্বিতীয়", p.accent2],
    ["রেখা", p.line]
  ].map(([name, hex]) => `<div class="swatch"><span class="chip" style="background:${hex}"></span><div class="meta"><b>${name}</b><span>${hex}</span></div></div>`).join("");

  const railSwatches = [p.accent, p.accent2, p.ink, p.bg, p.line]
    .map((c) => `<i style="background:${c}"></i>`).join("");

  const chatHtml = chat.map(([who, text], i) =>
    i === 1
      ? `<div class="design-bubble me"><div class="ava">তু</div><div class="bub">${esc(text)}</div></div>`
      : `<div class="design-bubble"><div class="ava">${who[0]}</div><div class="bub"><b style="display:block;font-size:11.5px;color:var(--accent);margin-bottom:2px">${who}</b>${esc(text)}</div></div>`
  ).join("");

  const notesHtml = notes.map((n, i) => `<div class="note-card"><span class="num">০${bn(i + 1)}</span><b>${n.b}</b><p>${n.p}</p></div>`).join("");

  const content = `<div class="design-shell layout-${d.layout}">
  <aside class="design-rail">
    <div class="rail-top"><span class="design-no">${pad(d.id)}</span><span class="design-of">/ ৫০</span></div>
    <div class="rail-name">${d.bn}</div>
    <div class="rail-swatches" aria-hidden="true">${railSwatches}</div>
    <nav class="rail-nav" aria-label="এই পাতার অংশ">
      <a href="#tokens">রঙ</a>
      <a href="#type">টাইপ</a>
      <a href="#parts">কম্পোনেন্ট</a>
      <a href="#chat">আড্ডা</a>
      <a href="#notes">নোট</a>
    </nav>
    <a class="rail-back" href="/museverse/#designs">← সব ডিজাইন</a>
  </aside>

  <div class="design-main">
    <section class="design-hero">
      <div class="design-hero-copy">
        <span class="design-kicker">ডিজাইন ${pad(d.id)} · ${d.layout}</span>
        <h1>${d.bn}</h1>
        <p class="design-en">${d.en}</p>
        <p class="design-lead">${d.desc}</p>
        <div class="design-hero-meta">
          <span class="mv-tag is-accent">${d.fonts[0]}</span>
          <span class="mv-tag">${d.layout}</span>
          <span class="mv-tag">${d.pattern}</span>
        </div>
      </div>
      <div class="design-hero-art" aria-hidden="true">
        <span class="art-num">${pad(d.id)}</span>
        <span class="art-orb"></span>
        <span class="art-line"></span>
      </div>
    </section>

    <section class="design-block" id="tokens">
      <div class="design-block-head"><span>০১</span><h2>রঙের তালিকা</h2><p>সাতটা টোকেন — এখান থেকেই বাকি সব রং আসে।</p></div>
      <div class="swatch-grid">${swatches}</div>
      <div class="mv-row mv-mt">
        <button class="mv-btn mv-btn-sm mv-btn-ghost" type="button" data-copy="#tokenCss" data-label="CSS টোকেন কপি করো">CSS টোকেন কপি করো</button>
        <a class="mv-btn mv-btn-sm" href="#parts">কম্পোনেন্ট দেখো</a>
      </div>
      <pre id="tokenCss" style="margin-top:16px;padding:16px 18px;border-radius:12px;background:color-mix(in srgb,var(--ink) 92%,transparent);color:var(--bg);overflow:auto;font-size:12px;line-height:1.7"><code>${esc(tokenCss(d))}</code></pre>
    </section>

    <section class="design-block" id="type">
      <div class="design-block-head"><span>০২</span><h2>টাইপোগ্রাফি</h2><p>${d.fonts[0]} + ${d.fonts[1]}</p></div>
      <div class="type-specimen">
        <div class="type-row"><small>শিরোনাম</small><div class="type-h1">মিউজরা এখানে কথা বলে</div></div>
        <div class="type-row"><small>উপশিরোনাম</small><div class="type-h2">একটা ছোট শিরোনাম, বড় অর্থ</div></div>
        <div class="type-row"><small>বডি</small><div class="type-body">এই ডিজাইনে লেখা যতটা জরুরি, ফাঁকাও ততটা। বাক্য ছোট হলে পাঠক নিজের শ্বাসের সঙ্গে মিলিয়ে পড়তে পারে।</div></div>
        <div class="type-row"><small>ক্যাপশন</small><div class="type-caption">${d.en} · ${d.fonts[0]} / ${d.fonts[1]}</div></div>
      </div>
    </section>

    <section class="design-block" id="parts">
      <div class="design-block-head"><span>০৩</span><h2>কম্পোনেন্ট</h2><p>একই ভাষায় বাটন, ট্যাগ, ইনপুট আর কার্ড।</p></div>
      <div class="component-grid">
        <div class="component-panel">
          <h3>বাটন</h3>
          <div class="demo-buttons">
            <button class="demo-btn" type="button">আড্ডায় যাও</button>
            <button class="demo-btn ghost" type="button">একটা কবিতা</button>
            <button class="demo-btn dark" type="button">শেয়ার</button>
          </div>
          <div class="demo-tags"><span class="demo-tag on">কবিতা</span><span class="demo-tag">বৃষ্টি</span><span class="demo-tag">মিউজ</span><span class="demo-tag">আড্ডা</span></div>
          <div class="demo-input"><input type="text" placeholder="মিউজকে কিছু বলো…" aria-label="নমুনা ইনপুট"><button type="button" aria-label="পাঠাও">↑</button></div>
        </div>
        <div class="component-panel">
          <h3>কার্ড</h3>
          <div class="demo-mini-card"><b>আজকের ঘর</b><p>চা তৈরি, জানালা খোলা, আর একটা অসমাপ্ত গল্প।</p></div>
          <div class="demo-mini-card" style="margin-top:10px"><b>${d.bn}</b><p>${d.desc}</p></div>
        </div>
      </div>
    </section>

    <section class="design-block" id="chat">
      <div class="design-block-head"><span>০৪</span><h2>একটা আড্ডার টুকরো</h2><p>এই ডিজাইনে কথোপকথন কেমন দেখায়।</p></div>
      <div class="design-chat">
        <div class="design-chat-head"><span class="dot"></span><b>সান্ধ্য আড্ডা</b><span>ঘর: সবার জন্য খোলা</span></div>
        ${chatHtml}
      </div>
    </section>

    <section class="design-block" id="notes">
      <div class="design-block-head"><span>০৫</span><h2>ডিজাইন নোট</h2><p>কেন এটা এভাবে কাজ করে।</p></div>
      <div class="notes-grid">${notesHtml}</div>
    </section>

    <nav class="design-nav" aria-label="ডিজাইন বদলাও">
      <a href="${designHref(prev)}"><small>← ডিজাইন ${pad(prev.id)}</small><b>${prev.bn}</b></a>
      <a class="next" href="${designHref(next)}"><small>ডিজাইন ${pad(next.id)} →</small><b>${next.bn}</b></a>
      <a class="all" href="/museverse/#designs">সব ৫০ ডিজাইন</a>
    </nav>
  </div>
</div>`;

  const html = docStart({
    title: `${d.bn} — ডিজাইন ${pad(d.id)} · মিউজভার্স`,
    desc: `${d.desc} ${d.en} — ৫০টি ডিজাইনের সংগ্রহ থেকে একটি নমুনা।`,
    fonts: d.fonts,
    styles: ["/museverse/assets/base.css", "/museverse/assets/themes.css", "/museverse/assets/design.css"],
    bodyClass: `design-page layout-${d.layout}`,
    theme: themeId(d.id),
    active: "designs"
  }) + content + docEnd();
  write(`designs/${pad(d.id)}-${d.slug}.html`, html);
  return html;
}

export function buildDesigns() {
  DESIGNS.forEach(buildDesignPage);
  return DESIGNS.length;
}
