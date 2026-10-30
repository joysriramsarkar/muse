/* মিউজভার্স — build 20 motion specimen pages */

import { MOTIONS_A } from "./mv-data-motions-a.mjs";
import { MOTIONS_B } from "./mv-data-motions-b.mjs";
import {
  esc, bn, pad, write, docStart, docEnd, motionHref
} from "./mv-lib.mjs";

export const MOTIONS = [...MOTIONS_A, ...MOTIONS_B];
const JS_DEMOS = new Set(["particles", "confetti", "cursor-trail", "parallax"]);

function buildMotionPage(m) {
  const idx = MOTIONS.findIndex((x) => x.id === m.id);
  const prev = MOTIONS[(idx - 1 + MOTIONS.length) % MOTIONS.length];
  const next = MOTIONS[(idx + 1) % MOTIONS.length];
  const demo = JS_DEMOS.has(m.slug) ? m.slug : "";

  const content = `<div class="motion-shell">
  <header class="motion-hero">
    <span class="mv-eyebrow">মোশন ${pad(m.id)} / ২০</span>
    <h1>${m.bn}</h1>
    <p class="motion-en">${m.en}</p>
    <p class="motion-lead">${m.desc}</p>
    <div class="motion-meta">
      <span class="mv-tag is-accent">CSS + JS</span>
      <span class="mv-tag">${m.en}</span>
      <span class="mv-tag">রিপ্লে করা যায়</span>
    </div>
  </header>

  <section class="motion-stage-wrap" aria-label="অ্যানিমেশন নমুনা">
    <div class="motion-toolbar">
      <button class="primary" type="button" data-replay>↻ আবার চালাও</button>
      <button type="button" data-pause aria-pressed="false">থামাও</button>
      <label>গতি <input type="range" min="0.5" max="2" step="0.1" value="1" data-speed><span class="speed-val">1.0×</span></label>
    </div>
    <div class="motion-stage run" data-motion-stage${demo ? ` data-demo="${demo}"` : ""}>
      ${m.demo}
      <span class="stage-note">${m.en}</span>
      <span class="stage-label">MOTION ${pad(m.id)}</span>
    </div>
  </section>

  <section class="motion-block">
    <h2>কীভাবে কাজ করে</h2>
    <p>${m.desc}</p>
    <ul class="motion-points">
      <li><b>কোথায় ভালো লাগে</b>${m.use}</li>
      <li><b>সতর্কতা</b>${m.care}</li>
      <li><b>নিয়ন্ত্রণ</b>উপরের “আবার চালাও” বাটনে রিপ্লে, স্লাইডারে গতি, আর “থামাও” বাটনে বিরতি।</li>
      <li><b>অ্যাক্সেসিবিলিটি</b>prefers-reduced-motion থাকলে অ্যানিমেশন ধীর বা বন্ধ রাখা ভালো — এই পাতায় সেটার জন্য CSS আছে।</li>
    </ul>
  </section>

  <section class="motion-block">
    <h2>কোড</h2>
    <p>মূল CSS-টা এখানে — কপি করে নিজের পাতায় বসাতে পারো।</p>
    <div class="motion-code">
      <button class="copy-code" type="button" data-copy="#motionCode" data-label="কপি">কপি</button>
      <pre id="motionCode"><code>${esc(m.snippet)}</code></pre>
    </div>
  </section>

  <nav class="motion-nav" aria-label="মোশন বদলাও">
    <a href="${motionHref(prev)}"><small>← মোশন ${pad(prev.id)}</small><b>${prev.bn}</b></a>
    <a class="next" href="${motionHref(next)}"><small>মোশন ${pad(next.id)} →</small><b>${next.bn}</b></a>
    <a class="all" href="/museverse/#motion">সব ২০ মোশন</a>
  </nav>
</div>`;

  const html = docStart({
    title: `${m.bn} — মোশন ${pad(m.id)} · মিউজভার্স`,
    desc: `${m.desc} — ২০টি অ্যানিমেশন নমুনার একটি।`,
    fonts: ["Hind Siliguri", "Noto Serif Bengali"],
    styles: ["/museverse/assets/base.css", "/museverse/assets/motion.css"],
    inline: m.css,
    bodyClass: "motion-page",
    theme: "theme-hub",
    active: "motion"
  }) + content + docEnd();
  write(`motion/${pad(m.id)}-${m.slug}.html`, html);
  return html;
}

export function buildMotions() {
  MOTIONS.forEach(buildMotionPage);
  return MOTIONS.length;
}
