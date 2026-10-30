/* মিউজভার্স — motion specimens 11–20 */

export const MOTIONS_B = [
  {
    id: 11, slug: "gradient-shift", bn: "গ্রেডিয়েন্ট শিফট", en: "Gradient Shift",
    desc: "রঙের ঢেউ ধীরে সরে যায় — টেক্সট বা ব্যাকগ্রাউন্ডে জীবন্ত অনুভূতি।",
    use: "হিরো টেক্সট, বাটন, বা ব্র্যান্ডের মূল বার্তায়।",
    care: "অনেক রঙ একসঙ্গে দিলে পড়া কঠিন হয়; টেক্সটের পেছনে গাঢ় স্তর রাখো।",
    demo: `<div class="stage-center"><div class="gradient-scene"><span class="gradient-word">রং বদলায়</span><span class="gradient-bar"></span><p class="m-ghost">ধীরে, প্রায় শ্বাসের মতো।</p></div></div>`,
    css: `.motion-stage .gradient-scene{text-align:center;width:min(640px,90%)}
.motion-stage .gradient-word{display:block;font-family:var(--font-head);font-size:clamp(38px,8vw,72px);font-weight:700;line-height:1.1;letter-spacing:-.04em;background:linear-gradient(100deg,var(--accent),var(--accent-2),var(--accent));background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:mvGradient calc(5s / var(--speed)) linear infinite}
.motion-stage .gradient-bar{display:block;height:8px;margin:20px auto 14px;width:min(280px,70%);border-radius:99px;background:linear-gradient(90deg,var(--accent),var(--accent-2),var(--accent));background-size:300% 100%;animation:mvGradient calc(4s / var(--speed)) linear infinite}
@keyframes mvGradient{to{background-position:300% 50%}}`,
    snippet: `.gradient-text{background:linear-gradient(100deg,#C15F3C,#5E6B4F,#C15F3C);
  background-size:300% 100%;
  -webkit-background-clip:text;background-clip:text;color:transparent;
  animation:shift 5s linear infinite}
@keyframes shift{to{background-position:300% 50%}}`
  },
  {
    id: 12, slug: "draw-line", bn: "ড্র-লাইন", en: "Draw Line",
    desc: "SVG রেখা নিজেকে এঁকে ফেলে, যেন কেউ কলম দিয়ে লিখছে।",
    use: "আন্ডারলাইন, আইকন, চার্ট, বা সিগনেচার-ধাঁচের অলংকরণে।",
    care: "stroke-dasharray পাথের দৈর্ঘ্যের সঙ্গে মিলতে হবে; pathLength ব্যবহার করলে সহজ।",
    demo: `<div class="stage-center"><div class="draw-scene"><svg viewBox="0 0 420 160" fill="none" aria-hidden="true"><path class="draw-path" d="M18 108 C 78 34, 128 142, 190 78 S 292 28, 402 92" pathLength="100"/><circle class="draw-dot" cx="402" cy="92" r="6"/></svg><p class="m-ghost">একটা লাইন, একটা শ্বাস।</p></div></div>`,
    css: `.motion-stage .draw-scene{width:min(520px,90%);text-align:center}
.motion-stage .draw-scene svg{width:100%;height:auto;overflow:visible}
.motion-stage .draw-path{stroke:var(--accent);stroke-width:4;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:100}
.motion-stage .draw-dot{fill:var(--accent);opacity:0;transform-origin:402px 92px}
.motion-stage.run .draw-path{animation:mvDraw calc(2.2s / var(--speed)) var(--mv-ease-out) both}
.motion-stage.run .draw-dot{animation:mvDot calc(.5s / var(--speed)) ease 1.9s both}
@keyframes mvDraw{to{stroke-dashoffset:0}}
@keyframes mvDot{0%{opacity:0;transform:scale(.2)}100%{opacity:1;transform:scale(1)}}`,
    snippet: `.path{stroke-dasharray:100;stroke-dashoffset:100;
  animation:draw 2.2s ease both}
@keyframes draw{to{stroke-dashoffset:0}}`
  },
  {
    id: 13, slug: "parallax", bn: "প্যারালাক্স", en: "Parallax",
    desc: "মাউস নাড়ালে স্তরগুলো আলাদা গতিতে সরে — গভীরতার অনুভূতি।",
    use: "হিরো ইলাস্ট্রেশন, কার্ড, বা ইন্টারঅ্যাকটিভ ব্যানারে।",
    care: "মোবাইলে pointermove নেই; টাচের জন্য ডিভাইস ওরিয়েন্টেশন বা স্ক্রল ব্যবহার করো।",
    demo: `<div class="stage-center"><div class="parallax-scene"><span class="p-layer p1" style="--depth:26"></span><span class="p-layer p2" style="--depth:14"></span><span class="p-layer p3" style="--depth:34"></span><span class="p-core">মাউস নাড়াও</span></div></div>`,
    css: `.motion-stage .parallax-scene{position:relative;width:min(420px,90%);height:240px;display:grid;place-items:center}
.motion-stage .p-layer{position:absolute;border-radius:50%;pointer-events:none;transition:transform .12s linear}
.motion-stage .p1{width:150px;height:150px;left:8%;top:12%;background:color-mix(in srgb,var(--accent) 22%,transparent);border:1px solid var(--accent);transform:translate(calc(var(--mx,0) * var(--depth) * 1px),calc(var(--my,0) * var(--depth) * 1px))}
.motion-stage .p2{width:90px;height:90px;right:12%;bottom:12%;background:var(--accent-2);opacity:.75;transform:translate(calc(var(--mx,0) * var(--depth) * -1px),calc(var(--my,0) * var(--depth) * -1px))}
.motion-stage .p3{width:42px;height:42px;right:24%;top:16%;background:var(--accent);transform:translate(calc(var(--mx,0) * var(--depth) * 1px),calc(var(--my,0) * var(--depth) * -1px))}
.motion-stage .p-core{position:relative;z-index:2;font-family:var(--font-head);font-size:22px;padding:12px 22px;border-radius:999px;background:var(--panel);border:1px solid var(--line);box-shadow:var(--shadow);transform:translate(calc(var(--mx,0) * -12px),calc(var(--my,0) * -12px))}`,
    snippet: `.scene{--mx:0;--my:0}
.layer{transform:translate(calc(var(--mx,0) * 30px),calc(var(--my,0) * 30px))}
// pointermove: mx = x / width - .5`
  },
  {
    id: 14, slug: "particles", bn: "পার্টিকলস", en: "Particles",
    desc: "অসংখ্য ছোট কণা ধীরে ভেসে বেড়ায় — জোনাকি বা তারার মতো।",
    use: "গাঢ় ব্যাকগ্রাউন্ড, হিরো সেকশন, বা বিশেষ ইভেন্টের মেজাজে।",
    care: "কণার সংখ্যা কম রাখো (৩০-৫০); মোবাইলে আরও কম।",
    demo: `<div class="stage-center"><div class="particle-scene"><div class="particle-field"></div><span class="particle-core">মিউজ</span></div></div>`,
    css: `.motion-stage .particle-scene{position:relative;width:min(520px,92%);height:280px;display:grid;place-items:center;overflow:hidden;border-radius:18px;background:radial-gradient(circle at 50% 50%,color-mix(in srgb,var(--accent) 12%,transparent),transparent 70%)}
.motion-stage .particle-field{position:absolute;inset:0}
.motion-stage .particle{position:absolute;left:var(--x);top:var(--y);width:var(--s);height:var(--s);border-radius:50%;background:var(--accent);opacity:0;box-shadow:0 0 8px color-mix(in srgb,var(--accent) 60%,transparent);animation:mvParticle calc(var(--d) / var(--speed)) linear var(--delay) infinite}
.motion-stage .particle-core{position:relative;z-index:2;font-family:var(--font-head);font-size:26px;color:var(--ink);padding:10px 20px;border-radius:999px;background:color-mix(in srgb,var(--panel) 80%,transparent);backdrop-filter:blur(8px);border:1px solid var(--line)}
@keyframes mvParticle{0%{opacity:0;transform:translate(0,0) scale(.6)}20%{opacity:.9}80%{opacity:.8}100%{opacity:0;transform:translate(var(--dx),-90px) scale(1.15)}}`,
    snippet: `.particle{position:absolute;left:var(--x);top:var(--y);
  animation:rise var(--d) linear infinite}
@keyframes rise{0%{opacity:0;transform:translate(0,0)}
 20%{opacity:.9}100%{opacity:0;transform:translate(var(--dx),-90px)}}`
  },
  {
    id: 15, slug: "marquee", bn: "মার্কি", en: "Marquee",
    desc: "লেখা একদিকে বয়ে যায়, শেষ নেই — সিনেমার ক্রেডিট বা খবরের ফিতার মতো।",
    use: "ঘোষণা, ট্যাগলাইন, বা ব্র্যান্ডের পুনরাবৃত্তি।",
    care: "গতির সঙ্গে পড়ার সময় মিলিয়ে দাও; খুব দ্রুত হলে পড়া যায় না।",
    demo: `<div class="stage-center"><div class="marquee-window"><div class="marquee-track"><div class="marquee-group"><span>মিউজদের আড্ডাঘর</span><i>✦</i><span>একশো পাতা</span><i>✦</i><span>পঞ্চাশ ডিজাইন</span><i>✦</i></div><div class="marquee-group"><span>মিউজদের আড্ডাঘর</span><i>✦</i><span>একশো পাতা</span><i>✦</i><span>পঞ্চাশ ডিজাইন</span><i>✦</i></div></div></div></div>`,
    css: `.motion-stage .marquee-window{width:100%;overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:18px 0;background:color-mix(in srgb,var(--accent) 5%,transparent)}
.motion-stage .marquee-track{display:flex;width:max-content;animation:mvMarquee calc(18s / var(--speed)) linear infinite}
.motion-stage .marquee-group{display:flex;align-items:center;gap:22px;padding-right:22px;flex:none}
.motion-stage .marquee-group span{font-family:var(--font-head);font-size:clamp(22px,4vw,34px);white-space:nowrap;color:var(--ink)}
.motion-stage .marquee-group i{color:var(--accent);font-style:normal;font-size:18px}
@keyframes mvMarquee{to{transform:translateX(-50%)}}`,
    snippet: `.track{display:flex;width:max-content;
  animation:marquee 18s linear infinite}
@keyframes marquee{to{transform:translateX(-50%)}}`
  },
  {
    id: 16, slug: "wave", bn: "ওয়েভ", en: "Wave",
    desc: "SVG ঢেউ একটানা বয়ে যায় — নদী, সমুদ্র, বা শান্ত ছন্দ।",
    use: "সেকশন বিভাজক, ফুটার, বা তরল মেজাজের হিরোতে।",
    care: "দুই কপি না রাখলে লুপের মাঝে ফাঁক দেখা যায়।",
    demo: `<div class="stage-center"><div class="wave-window"><div class="wave-track"><svg viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 110 C 80 50, 150 160, 230 105 S 380 45, 460 105 S 550 155, 600 105 V200 H0 Z"/></svg><svg viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 110 C 80 50, 150 160, 230 105 S 380 45, 460 105 S 550 155, 600 105 V200 H0 Z"/></svg></div><span class="wave-label">নদীর মতো</span></div></div>`,
    css: `.motion-stage .wave-window{position:relative;width:100%;height:240px;overflow:hidden;background:linear-gradient(180deg,transparent 0 55%,color-mix(in srgb,var(--accent) 8%,transparent) 55%)}
.motion-stage .wave-track{position:absolute;left:0;right:0;bottom:0;display:flex;width:200%;height:180px;animation:mvWave calc(7s / var(--speed)) linear infinite}
.motion-stage .wave-track svg{width:50%;height:100%;flex:none}
.motion-stage .wave-track path{fill:var(--accent);opacity:.55}
.motion-stage .wave-track svg:nth-child(2) path{opacity:.28}
.motion-stage .wave-label{position:absolute;left:50%;top:34%;transform:translateX(-50%);font-family:var(--font-head);font-size:24px;color:var(--ink)}
@keyframes mvWave{to{transform:translateX(-50%)}}`,
    snippet: `.track{display:flex;width:200%;
  animation:wave 7s linear infinite}
.track svg{width:50%;flex:none}
@keyframes wave{to{transform:translateX(-50%)}}`
  },
  {
    id: 17, slug: "stagger", bn: "স্ট্যাগার", en: "Stagger",
    desc: "একটা তালিকার আইটেমগুলো একটার পর একটা আসে — ছন্দ তৈরি হয়।",
    use: "মেনু, ফিচার লিস্ট, বা ধাপে ধাপে দেখানো কনটেন্টে।",
    care: "দেরি বেশি হলে ব্যবহারকারী অপেক্ষা করে; প্রতি আইটেমে ৬০-১২০ms যথেষ্ট।",
    demo: `<div class="stage-center"><div class="stagger-list"><span class="stagger-item" style="--i:0">এক</span><span class="stagger-item" style="--i:1">দুই</span><span class="stagger-item" style="--i:2">তিন</span><span class="stagger-item" style="--i:3">চার</span><span class="stagger-item" style="--i:4">পাঁচ</span><span class="stagger-item" style="--i:5">ছয়</span></div></div>`,
    css: `.motion-stage .stagger-list{display:flex;flex-direction:column;gap:8px;width:min(360px,86%)}
.motion-stage .stagger-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:11px;background:var(--panel);border:1px solid var(--line);font-size:14px;opacity:0;transform:translateX(-18px)}
.motion-stage .stagger-item::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--accent);flex:none}
.motion-stage.run .stagger-item{animation:mvStagger calc(.7s / var(--speed)) var(--mv-ease-out) both;animation-delay:calc(var(--i) * .1s / var(--speed))}
@keyframes mvStagger{to{opacity:1;transform:none}}`,
    snippet: `.item{opacity:0;transform:translateX(-18px);
  animation:in .7s ease both;
  animation-delay:calc(var(--i) * .1s)}
@keyframes in{to{opacity:1;transform:none}}`
  },
  {
    id: 18, slug: "morph", bn: "মর্ফ", en: "Morph",
    desc: "একটা আকৃতি ধীরে অন্য আকৃতিতে বদলায় — তরল, জীবন্ত, অপ্রত্যাশিত।",
    use: "ব্যাকগ্রাউন্ড ব্লব, অ্যাভাটার ফ্রেম, বা লোডিং অবস্থায়।",
    care: "অনেক এলিমেন্টে একসঙ্গে মর্ফ করলে GPU চাপে পড়ে; দুয়েকটাতেই সীমিত রাখো।",
    demo: `<div class="stage-center"><div class="morph-blob"><span>মিউজ</span></div></div>`,
    css: `.motion-stage .morph-blob{width:190px;height:190px;display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--bg);font-family:var(--font-head);font-size:27px;font-weight:700;border-radius:62% 38% 46% 54% / 45% 52% 48% 55%;animation:mvMorph calc(6s / var(--speed)) ease-in-out infinite;box-shadow:0 24px 60px color-mix(in srgb,var(--accent) 28%,transparent)}
@keyframes mvMorph{0%,100%{border-radius:62% 38% 46% 54% / 45% 52% 48% 55%;transform:rotate(0) scale(1)}33%{border-radius:38% 62% 60% 40% / 55% 42% 58% 45%;transform:rotate(6deg) scale(1.04)}66%{border-radius:50% 50% 34% 66% / 62% 38% 62% 38%;transform:rotate(-5deg) scale(.98)}}`,
    snippet: `.blob{border-radius:62% 38% 46% 54% / 45% 52% 48% 55%;
  animation:morph 6s ease-in-out infinite}
@keyframes morph{33%{border-radius:38% 62% 60% 40% / 55% 42% 58% 45%}
 66%{border-radius:50% 50% 34% 66% / 62% 38% 62% 38%}}`
  },
  {
    id: 19, slug: "confetti", bn: "কনফেটি", en: "Confetti",
    desc: "রঙিন কাগজের টুকরো উপরে ফুটে গিয়ে পড়ে — উদযাপনের সহজ ভাষা।",
    use: "সফল সাবমিশন, জন্মদিন, বা কোনো মাইলস্টোনে।",
    care: "বারবার ট্রিগার করলে বিরক্তিকর; একবারই চালাও, তারপর থামাও।",
    demo: `<div class="stage-center"><div class="confetti-scene"><div class="confetti-field"></div><span class="confetti-core">উৎসব</span></div></div>`,
    css: `.motion-stage .confetti-scene{position:relative;width:min(520px,92%);height:280px;display:grid;place-items:center;overflow:hidden;border-radius:18px;background:color-mix(in srgb,var(--accent) 5%,transparent)}
.motion-stage .confetti-field{position:absolute;inset:0;overflow:hidden}
.motion-stage .confetti-bit{position:absolute;left:var(--x);top:-12%;width:var(--w);height:calc(var(--w) * 1.7);background:var(--c);border-radius:2px;opacity:0;transform:rotate(var(--r));animation:mvConfetti calc(var(--d) / var(--speed)) var(--mv-ease-out) var(--delay) forwards}
.motion-stage .confetti-core{position:relative;z-index:2;font-family:var(--font-head);font-size:30px;padding:10px 22px;border-radius:999px;background:var(--panel);border:1px solid var(--line);box-shadow:var(--shadow)}
@keyframes mvConfetti{0%{opacity:1;transform:translateY(0) rotate(var(--r))}100%{opacity:0;transform:translateY(330px) rotate(calc(var(--r) + 540deg))}}`,
    snippet: `.bit{position:absolute;left:var(--x);top:-12%;
  animation:fall var(--d) ease-out forwards}
@keyframes fall{0%{opacity:1}
 100%{opacity:0;transform:translateY(330px) rotate(540deg)}}`
  },
  {
    id: 20, slug: "cursor-trail", bn: "কার্সর ট্রেইল", en: "Cursor Trail",
    desc: "মাউস যেদিকে যায়, পেছনে ছোট ছোট বিন্দু জ্বলে ওঠে — খেলার মতো।",
    use: "ইন্টারঅ্যাকটিভ হিরো, আর্ট পেজ, বা বিশেষ ইভেন্টে।",
    care: "সব পেজে দিলে বিরক্তিকর; টাচ ডিভাইসে কাজ করে না, fallback রাখো।",
    demo: `<div class="stage-center"><div class="trail-scene"><div class="trail-field"></div><span class="trail-core">মাউস নাড়াও</span></div></div>`,
    css: `.motion-stage .trail-scene{position:relative;width:min(520px,92%);height:280px;display:grid;place-items:center;overflow:hidden;border-radius:18px;background:radial-gradient(circle at 50% 50%,color-mix(in srgb,var(--accent) 8%,transparent),transparent 70%);cursor:crosshair}
.motion-stage .trail-field{position:absolute;inset:0;overflow:hidden}
.motion-stage .trail-dot{position:absolute;width:11px;height:11px;border-radius:50%;background:hsl(calc(18 + var(--h)) 72% 56%);transform:translate(-50%,-50%);pointer-events:none;animation:mvTrail .95s ease-out forwards}
.motion-stage .trail-core{position:relative;z-index:2;font-family:var(--font-head);font-size:24px;color:var(--muted);pointer-events:none}
@keyframes mvTrail{0%{opacity:.95;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(.1)}}`,
    snippet: `.dot{position:absolute;width:11px;height:11px;border-radius:50%;
  animation:trail .95s ease-out forwards}
@keyframes trail{0%{opacity:.95;transform:translate(-50%,-50%) scale(1)}
 100%{opacity:0;transform:translate(-50%,-50%) scale(.1)}}`
  }
];
