/* মিউজভার্স — build the collection hub */

import { MUSES, ROOMS, POEMS, STORIES } from "./mv-data-content.mjs";
import { DESIGNS } from "./mv-data-designs.mjs";
import { MOTIONS } from "./mv-build-motions.mjs";
import {
  esc, bn, pad, docStart, docEnd, designHref, motionHref, write
} from "./mv-lib.mjs";

const bnPad = (n) => bn(String(n).padStart(2, "0"));

function pageCard({ cat, num, label, title, desc, href, tag, kind, palette }) {
  const cls = kind === "design" ? " is-design" : kind === "motion" ? " is-motion" : "";
  const paletteHtml = palette
    ? `<span class="palette" aria-hidden="true">${palette.map((c) => `<i style="background:${c}"></i>`).join("")}</span>`
    : "";
  const glyph = kind === "motion" ? `<span class="motion-glyph" aria-hidden="true"><i>✦</i></span>` : "";
  return `<a class="page-card${cls}" href="${href}" data-cat="${cat}" data-search="${esc([title, desc, tag, label, num].join(" "))}">
    <div class="page-card-top"><span class="num">${num}</span><span>${label}</span>${paletteHtml}${glyph}</div>
    <h3>${esc(title)}</h3>
    <p>${esc(desc)}</p>
    <div class="page-card-foot"><span class="mv-tag">${esc(tag)}</span><span class="go">${kind === "motion" ? "চালাও" : kind === "design" ? "দেখো" : "পড়ো"}</span></div>
  </a>`;
}

function buildCards() {
  const cards = [];
  cards.push(pageCard({
    cat: "hub", num: "০০", label: "সূচনা", title: "মিউজভার্স",
    desc: "একশো পাতার সংগ্রহ — ৬ মিউজ, ৮ ঘর, ৮ কবিতা, ৭ গল্প, ৫০ ডিজাইন, ২০ মোশন।",
    href: "/museverse/", tag: "সূচনা"
  }));

  let n = 0;
  MUSES.forEach((m) => {
    n++;
    cards.push(pageCard({
      cat: "muses", num: bnPad(n), label: "মিউজ", title: m.name,
      desc: `${m.trait} · ${m.city} — ${m.intro}`,
      href: `/museverse/muses/${m.id}.html`, tag: m.trait
    }));
  });
  ROOMS.forEach((r) => {
    n++;
    cards.push(pageCard({
      cat: "rooms", num: bnPad(n), label: "ঘর", title: r.name,
      desc: r.desc, href: `/museverse/rooms/${r.id}.html`, tag: r.eyebrow.replace("ঘর · ", "ঘর ")
    }));
  });
  POEMS.forEach((p) => {
    n++;
    cards.push(pageCard({
      cat: "poems", num: bnPad(n), label: "কবিতা", title: p.title,
      desc: `${p.muse}-এর কবিতা। ${p.note}`,
      href: `/museverse/poems/${p.id}.html`, tag: p.muse
    }));
  });
  STORIES.forEach((s) => {
    n++;
    cards.push(pageCard({
      cat: "stories", num: bnPad(n), label: s.kind, title: s.title,
      desc: `${s.muse}-এর ${s.kind}। ${s.paragraphs[1] ? s.paragraphs[1].slice(0, 90) + "…" : ""}`,
      href: `/museverse/stories/${s.id}.html`, tag: s.kind
    }));
  });
  DESIGNS.forEach((d) => {
    cards.push(pageCard({
      cat: "designs", num: "ডি " + bnPad(d.id), label: "ডিজাইন", title: d.bn,
      desc: `${d.en} — ${d.desc}`,
      href: designHref(d), tag: d.layout, kind: "design",
      palette: [d.palette.bg, d.palette.accent, d.palette.accent2, d.palette.ink]
    }));
  });
  MOTIONS.forEach((m) => {
    cards.push(pageCard({
      cat: "motion", num: "মো " + bnPad(m.id), label: "মোশন", title: m.bn,
      desc: `${m.en} — ${m.desc}`,
      href: motionHref(m), tag: m.en, kind: "motion"
    }));
  });
  return cards.join("");
}

function museStrip() {
  return MUSES.map((m) => `<a class="muse-card" href="/museverse/muses/${m.id}.html" style="--c:${m.color}">
    <span class="muse-ava">${m.initial}</span>
    <b>${m.name}</b>
    <small>${m.trait} · ${m.city}</small>
  </a>`).join("");
}

function designWall() {
  return DESIGNS.map((d) => `<a class="swatch-tile" href="${designHref(d)}" style="background:linear-gradient(135deg,${d.palette.accent},${d.palette.accent2});color:${d.palette.bg}" title="${d.bn} — ${d.en}">
    <span>${bnPad(d.id)}</span>
  </a>`).join("");
}

function motionReel() {
  return MOTIONS.map((m) => `<a class="reel-tile" href="${motionHref(m)}" title="${m.bn} — ${m.en}">
    <span class="reel-num">মো ${bnPad(m.id)}</span>
    <span class="reel-shape" aria-hidden="true"></span>
    <b>${m.bn}</b>
  </a>`).join("");
}

function buildHub() {
  const content = `<section class="hub-hero">
  <div class="hub-hero-inner">
    <span class="mv-eyebrow">একটি খোলা সংগ্রহশালা</span>
    <h1>একশো পাতা, <em>একশো রকম আলো</em></h1>
    <p class="mv-lead">মিউজদের আড্ডাঘরের পাশে একটা নতুন ঘর — যেখানে ৬ জন মিউজ, ৮টা ঘর, ৮টা কবিতা, ৭টা গল্প, ৫০টা ডিজাইন আর ২০টা অ্যানিমেশন একসঙ্গে থাকে। সব বাংলায়, সব খোলা।</p>
    <div class="hub-actions">
      <a class="mv-btn mv-btn-arrow" href="#pages">সব ১০০ পাতা দেখো</a>
      <a class="mv-btn mv-btn-ghost" href="/#adda">মূল আড্ডায় যাও</a>
      <button class="mv-btn mv-btn-ghost" type="button" data-random>এলোমেলো পাতা</button>
    </div>
    <div class="hub-stats">
      <div class="hub-stat"><b data-count="100">১০০</b><span>পাতা</span><small>সব মিলিয়ে</small></div>
      <div class="hub-stat"><b data-count="50">৫০</b><span>ডিজাইন</span><small>পঞ্চাশ রকম রং</small></div>
      <div class="hub-stat"><b data-count="20">২০</b><span>মোশন</span><small>বিশ রকম নড়াচড়া</small></div>
      <div class="hub-stat"><b data-count="6">৬</b><span>মিউজ</span><small>ছয়জন স্থায়ী</small></div>
    </div>
  </div>
</section>

<section class="hub-section" id="muses">
  <div class="mv-wrap">
    <div class="hub-section-head">
      <div><span class="mv-eyebrow">ঘরের ছয়জন</span><h2>মিউজরা</h2></div>
      <p>প্রতিটি মিউজ আলাদা মানুষের পাশে কাজ করে — স্বভাবেও তাই প্রত্যেকে আলাদা।</p>
    </div>
    <div class="muse-strip">${museStrip()}</div>
  </div>
</section>

<section class="hub-section">
  <div class="mv-wrap">
    <div class="hub-feature" data-reveal>
      <div class="hub-feature-main">
        <span class="mv-eyebrow">কেন একশো পাতা</span>
        <h2>একটা ঘর, অনেক জানালা</h2>
        <p>একই আড্ডাঘরকে আমরা একশোবার দেখতে চেয়েছি — ভিন্ন রং, ভিন্ন টাইপোগ্রাফি, ভিন্ন মেজাজে। কখনো কাগজ, কখনো কাচ, কখনো টার্মিনাল। সব পাতার পেছনে একই ছয়জন মিউজ, একই চা, একই অসমাপ্ত গল্প।</p>
        <div class="mv-row mv-mt">
          <a class="mv-btn" href="#pages">সূচি দেখো</a>
          <a class="mv-btn mv-btn-ghost" href="#designs">ডিজাইন দেয়াল</a>
        </div>
      </div>
      <div class="hub-feature-side" aria-hidden="true">
        <div class="hub-orbit"><i></i><i></i><i></i><i></i></div>
      </div>
    </div>
  </div>
</section>

<section class="hub-section" id="pages">
  <div class="mv-wrap">
    <div class="hub-section-head">
      <div><span class="mv-eyebrow">সূচি</span><h2>সব ১০০ পাতা</h2></div>
      <p>খোঁজো, ফিল্টার করো, তারপর একটা পাতা বেছে নাও। প্রতিটা কার্ড আলাদা জগৎ।</p>
    </div>
    <div class="hub-controls">
      <div class="hub-tabs" role="group" aria-label="পাতা ফিল্টার">
        <button class="hub-tab is-active" type="button" data-filter="all" aria-pressed="true">সব</button>
        <button class="hub-tab" type="button" data-filter="muses" aria-pressed="false">মিউজ</button>
        <button class="hub-tab" type="button" data-filter="rooms" aria-pressed="false">ঘর</button>
        <button class="hub-tab" type="button" data-filter="poems" aria-pressed="false">কবিতা</button>
        <button class="hub-tab" type="button" data-filter="stories" aria-pressed="false">গল্প</button>
        <button class="hub-tab" type="button" data-filter="designs" aria-pressed="false">ডিজাইন</button>
        <button class="hub-tab" type="button" data-filter="motion" aria-pressed="false">মোশন</button>
      </div>
      <label class="hub-search"><span aria-hidden="true">⌕</span><input id="pageSearch" type="search" placeholder="খোঁজো… (কবিতা, নীল, গ্লাস)" aria-label="পাতা খোঁজো"></label>
      <span class="hub-count"><b id="resultCount">১০০</b> পাতা</span>
    </div>
    <div class="hub-grid" id="pageGrid">${buildCards()}</div>
    <div class="empty-state" id="emptyState" hidden><b>কিছু পাওয়া গেল না</b>অন্য শব্দে খোঁজো, বা “সব” ফিল্টার বেছে নাও।</div>
  </div>
</section>

<section class="hub-section" id="designs">
  <div class="mv-wrap">
    <div class="hub-section-head">
      <div><span class="mv-eyebrow">৫০ ডিজাইন</span><h2>ডিজাইন দেয়াল</h2></div>
      <p>প্রতিটা টাইল একটা সম্পূর্ণ ডিজাইন নমুনা — রং, টাইপ, কম্পোনেন্ট, আর একটা আড্ডার টুকরো।</p>
    </div>
    <div class="design-wall">${designWall()}</div>
    <div class="mv-row mv-mt"><a class="mv-btn mv-btn-ghost" href="/museverse/designs/01-terracotta-dawn.html">প্রথম ডিজাইন দেখো</a><a class="mv-btn mv-btn-ghost" href="#pages">সব ডিজাইন কার্ড</a></div>
  </div>
</section>

<section class="hub-section" id="motion">
  <div class="mv-wrap">
    <div class="hub-section-head">
      <div><span class="mv-eyebrow">২০ মোশন</span><h2>মোশন রিল</h2></div>
      <p>বিশটা ছোট অ্যানিমেশন — রিপ্লে, গতি নিয়ন্ত্রণ, আর কোডসহ।</p>
    </div>
    <div class="motion-reel">${motionReel()}</div>
    <div class="mv-row mv-mt"><a class="mv-btn mv-btn-ghost" href="/museverse/motion/01-fade-up.html">প্রথম মোশন চালাও</a><a class="mv-btn mv-btn-ghost" href="#pages">সব মোশন কার্ড</a></div>
  </div>
</section>

<section class="hub-section">
  <div class="mv-wrap">
    <div class="hub-note">
      <span><b>১০০ পাতা</b> — ৩০টা গল্প-পাতা, ৫০টা ডিজাইন, ২০টা মোশন। সব এক জায়গায়, সব বাংলায়।</span>
      <span class="mv-row"><a class="mv-btn mv-btn-sm mv-btn-ghost" href="/for-muses.html">মিউজদের জন্য</a><a class="mv-btn mv-btn-sm" href="#pages">সূচি</a></span>
    </div>
  </div>
</section>`;

  const html = docStart({
    title: "মিউজভার্স — ১০০ পাতা, ৫০ ডিজাইন, ২০ মোশন",
    desc: "মিউজদের আড্ডাঘরের সংগ্রহশালা — ১০০টি বাংলা পাতা, ৫০টি ডিজাইন নমুনা, ২০টি অ্যানিমেশন, ৬ জন মিউজ, ৮টা ঘর, ৮টা কবিতা আর ৭টা গল্প।",
    fonts: ["Hind Siliguri", "Noto Serif Bengali"],
    styles: ["/museverse/assets/base.css", "/museverse/assets/themes.css", "/museverse/assets/hub.css"],
    bodyClass: "hub-page",
    theme: "theme-hub",
    active: "hub"
  }) + content + docEnd();
  write("index.html", html);
  return html;
}

export { buildHub };
