/* মিউজভার্স — motion specimens 01–10 */

export const MOTIONS_A = [
  {
    id: 1, slug: "fade-up", bn: "ফেড-আপ", en: "Fade Up",
    desc: "কনটেন্ট নিচ থেকে ধীরে উঠে আসে, সঙ্গে opacity। সবচেয়ে নিরাপদ প্রবেশ-অ্যানিমেশন।",
    use: "পেজের প্রথম স্ক্রিন, কার্ডের তালিকা, বা সদ্য লোড হওয়া কোনো অংশে।",
    care: "একসঙ্গে অনেক এলিমেন্টে দিলে ধীর লাগে; ছোট স্ট্যাগার রাখো।",
    demo: `<div class="stage-center"><div class="fade-stack"><span class="m-pill">প্রথম লাইন</span><span class="m-pill">দ্বিতীয় লাইন</span><span class="m-pill">তৃতীয় লাইন</span></div></div>`,
    css: `.motion-stage .fade-stack{display:flex;flex-direction:column;gap:12px;align-items:center}
.motion-stage .fade-stack .m-pill{opacity:0;transform:translateY(26px)}
.motion-stage.run .fade-stack .m-pill{animation:mvFadeUp calc(1.1s / var(--speed)) var(--mv-ease-out) both}
.motion-stage.run .fade-stack .m-pill:nth-child(1){animation-delay:calc(.05s / var(--speed))}
.motion-stage.run .fade-stack .m-pill:nth-child(2){animation-delay:calc(.18s / var(--speed))}
.motion-stage.run .fade-stack .m-pill:nth-child(3){animation-delay:calc(.31s / var(--speed))}
@keyframes mvFadeUp{to{opacity:1;transform:none}}`,
    snippet: `.item{opacity:0;transform:translateY(26px)}
.item.run{animation:fadeUp .8s ease both}
@keyframes fadeUp{to{opacity:1;transform:none}}`
  },
  {
    id: 2, slug: "slide-in", bn: "স্লাইড-ইন", en: "Slide In",
    desc: "দুই পাশ থেকে দুইটা প্যানেল ঢুকে মাঝখানে মেলে। দিক দিয়ে গল্প বলে।",
    use: "তুলনা, আগে-পরে, বা দুই পক্ষের কথোপকথন দেখাতে।",
    care: "মোবাইলে দুই পাশের স্লাইড একসঙ্গে এলে আঁটসাঁট লাগে; একটার পর একটা দাও।",
    demo: `<div class="stage-center"><div class="slide-row"><div class="slide-card left"><b>আগে</b><span>চা ঠান্ডা</span></div><div class="slide-card right"><b>পরে</b><span>গল্প গরম</span></div></div></div>`,
    css: `.motion-stage .slide-row{display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap}
.motion-stage .slide-card{width:150px;padding:20px;border-radius:14px;background:var(--panel);border:1px solid var(--line);box-shadow:var(--shadow);text-align:center;opacity:0}
.motion-stage .slide-card b{display:block;font-family:var(--font-head);font-size:19px;margin-bottom:3px}
.motion-stage .slide-card span{font-size:12.5px;color:var(--muted)}
.motion-stage .slide-card.left{transform:translateX(-70px)}
.motion-stage .slide-card.right{transform:translateX(70px)}
.motion-stage.run .slide-card.left{animation:mvSlideL calc(1s / var(--speed)) var(--mv-ease-out) both}
.motion-stage.run .slide-card.right{animation:mvSlideR calc(1s / var(--speed)) var(--mv-ease-out) .12s both}
@keyframes mvSlideL{to{opacity:1;transform:none}}
@keyframes mvSlideR{to{opacity:1;transform:none}}`,
    snippet: `.left{transform:translateX(-70px);opacity:0}
.right{transform:translateX(70px);opacity:0}
.run .left{animation:slideL .9s ease both}
.run .right{animation:slideR .9s ease .12s both}
@keyframes slideL{to{transform:none;opacity:1}}
@keyframes slideR{to{transform:none;opacity:1}}`
  },
  {
    id: 3, slug: "zoom-in", bn: "জুম-ইন", en: "Zoom In",
    desc: "কার্ডটা ছোট ও ঝাপসা অবস্থা থেকে বড় হয়ে স্পষ্ট হয়। মনোযোগ টানার সহজ উপায়।",
    use: "একটা বিশেষ ঘোষণা, মডাল, বা নতুন কিছু দেখানোর সময়।",
    care: "বড় স্কেলে জুম ব্যবহার করলে মাথা ঘুরতে পারে; ১.১৫-১.৩ গুণেই যথেষ্ট।",
    demo: `<div class="stage-center"><div class="zoom-card"><span class="zoom-kicker">নতুন</span><b>মিউজভার্স</b><span>একশো পাতা, একশো রকম আলো</span></div></div>`,
    css: `.motion-stage .zoom-card{width:min(280px,78%);padding:28px 24px;border-radius:18px;background:var(--panel);border:1px solid var(--line);box-shadow:var(--shadow);text-align:center;opacity:0;transform:scale(.55);filter:blur(10px)}
.motion-stage .zoom-card b{display:block;font-family:var(--font-head);font-size:27px;line-height:1.2;margin:6px 0 5px}
.motion-stage .zoom-card span{display:block;font-size:12.5px;color:var(--muted)}
.motion-stage .zoom-kicker{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);font-weight:700}
.motion-stage.run .zoom-card{animation:mvZoom calc(1.15s / var(--speed)) var(--mv-ease-out) both}
@keyframes mvZoom{60%{opacity:1;filter:blur(0)}to{opacity:1;transform:scale(1);filter:blur(0)}}`,
    snippet: `.card{opacity:0;transform:scale(.55);filter:blur(10px)}
.card.run{animation:zoomIn 1s cubic-bezier(.16,1,.3,1) both}
@keyframes zoomIn{60%{opacity:1;filter:blur(0)}
  to{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  {
    id: 4, slug: "rotate-in", bn: "রোটেট-ইন", en: "Rotate In",
    desc: "একটা সিল বা ব্যাজ ঘুরে নিজের জায়গায় বসে। হাতে বানানো ছাপের অনুভূতি।",
    use: "স্ট্যাম্প, ব্যাজ, সনদ, বা ‘নতুন’ ট্যাগে।",
    care: "বড় এলিমেন্টে বেশি ঘোরালে পড়তে কষ্ট হয়; ১০-২০ ডিগ্রিতেই ভালো।",
    demo: `<div class="stage-center"><div class="stamp"><span>মিউজ</span><small>আড্ডাঘর</small></div></div>`,
    css: `.motion-stage .stamp{width:150px;height:150px;border-radius:50%;border:2px dashed var(--accent);display:grid;place-items:center;align-content:center;gap:2px;color:var(--accent);background:color-mix(in srgb,var(--accent) 7%,var(--panel));opacity:0;transform:rotate(-24deg) scale(.72)}
.motion-stage .stamp span{font-family:var(--font-head);font-size:27px;font-weight:700;line-height:1}
.motion-stage .stamp small{font-size:10px;letter-spacing:.2em;text-transform:uppercase}
.motion-stage.run .stamp{animation:mvStamp calc(1.1s / var(--speed)) var(--mv-ease-out) both}
@keyframes mvStamp{70%{opacity:1;transform:rotate(4deg) scale(1.03)}to{opacity:1;transform:rotate(0) scale(1)}}`,
    snippet: `.stamp{opacity:0;transform:rotate(-24deg) scale(.72)}
.stamp.run{animation:stampIn 1s cubic-bezier(.16,1,.3,1) both}
@keyframes stampIn{70%{transform:rotate(4deg) scale(1.03)}
  to{opacity:1;transform:none}}`
  },
  {
    id: 5, slug: "flip", bn: "ফ্লিপ", en: "3D Flip",
    desc: "কার্ডটা 3D-তে ঘুরে পেছনের দিক দেখায়। দুইটা বার্তা এক জায়গায় রাখার কৌশল।",
    use: "আগে-পরে, প্রশ্ন-উত্তর, বা কার্ডের পেছনে লুকানো তথ্য দেখাতে।",
    care: "backface-visibility ঠিক না করলে পেছনের লেখা উল্টো দেখা যায়।",
    demo: `<div class="stage-center"><div class="flip-card"><div class="flip-inner"><div class="flip-face front"><span>প্রশ্ন</span><b>কবিতা কী?</b></div><div class="flip-face back"><span>উত্তর</span><b>একটা দীর্ঘ শ্বাস।</b></div></div></div></div>`,
    css: `.motion-stage .flip-card{width:min(260px,76%);aspect-ratio:1.45;perspective:900px}
.motion-stage .flip-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d}
.motion-stage .flip-face{position:absolute;inset:0;border-radius:16px;display:grid;place-content:center;text-align:center;padding:20px;backface-visibility:hidden;border:1px solid var(--line);box-shadow:var(--shadow)}
.motion-stage .flip-face span{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:6px}
.motion-stage .flip-face b{font-family:var(--font-head);font-size:22px;line-height:1.3}
.motion-stage .flip-face.front{background:var(--panel)}
.motion-stage .flip-face.back{background:var(--accent);color:var(--bg);transform:rotateY(180deg)}
.motion-stage .flip-face.back span{color:var(--bg);opacity:.7}
.motion-stage.run .flip-inner{animation:mvFlip calc(3.6s / var(--speed)) var(--mv-ease) infinite}
@keyframes mvFlip{0%,18%{transform:rotateY(0)}45%,55%{transform:rotateY(180deg)}82%,100%{transform:rotateY(360deg)}}`,
    snippet: `.flip-inner{transform-style:preserve-3d;animation:flip 3.6s ease infinite}
.face{position:absolute;inset:0;backface-visibility:hidden}
.back{transform:rotateY(180deg)}
@keyframes flip{0%,18%{transform:rotateY(0)}
 45%,55%{transform:rotateY(180deg)}82%,100%{transform:rotateY(360deg)}}`
  },
  {
    id: 6, slug: "bounce", bn: "বাউন্স", en: "Bounce",
    desc: "বলটা মেঝেতে পড়ে চেপে যায়, তারপর আবার উঠে। ওজন বোঝানোর সহজ উপায়।",
    use: "লোডিং, নোটিফিকেশন, বা খেলার মেজাজের কোনো এলিমেন্টে।",
    care: "অসীম বাউন্স দীর্ঘ সময় চললে বিরক্তিকর; কয়েক সেকেন্ডেই থামাও।",
    demo: `<div class="stage-center"><div class="bounce-scene"><span class="ball"></span><span class="ball-shadow"></span></div></div>`,
    css: `.motion-stage .bounce-scene{position:relative;width:160px;height:220px}
.motion-stage .ball{position:absolute;left:50%;top:16px;width:64px;height:64px;margin-left:-32px;border-radius:50%;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--accent) 55%,#fff),var(--accent));box-shadow:0 14px 24px color-mix(in srgb,var(--accent) 30%,transparent)}
.motion-stage .ball-shadow{position:absolute;left:50%;bottom:16px;width:70px;height:12px;margin-left:-35px;border-radius:50%;background:var(--ink);opacity:.16;filter:blur(3px)}
.motion-stage.run .ball{animation:mvBall calc(1.15s / var(--speed)) cubic-bezier(.3,.7,.4,1) infinite}
.motion-stage.run .ball-shadow{animation:mvBallShadow calc(1.15s / var(--speed)) cubic-bezier(.3,.7,.4,1) infinite}
@keyframes mvBall{0%,100%{transform:translateY(0) scale(1,1)}12%{transform:translateY(0) scale(1.08,.9)}45%{transform:translateY(128px) scale(1,1)}55%{transform:translateY(128px) scale(1.16,.82)}90%{transform:translateY(0) scale(1,1)}}
@keyframes mvBallShadow{0%,100%{transform:scale(1);opacity:.16}50%{transform:scale(.62);opacity:.08}}`,
    snippet: `.ball{animation:bounce 1.1s cubic-bezier(.3,.7,.4,1) infinite}
@keyframes bounce{0%,100%{transform:translateY(0) scale(1)}
 12%{transform:translateY(0) scale(1.08,.9)}
 45%{transform:translateY(128px)}
 55%{transform:translateY(128px) scale(1.16,.82)}
 90%{transform:translateY(0)}}`
  },
  {
    id: 7, slug: "pulse", bn: "পালস", en: "Pulse",
    desc: "কেন্দ্র থেকে Rings ছড়িয়ে পড়ে, যেন কোনো কিছু জীবন্ত।",
    use: "লাইভ ব্যাজ, রেকর্ডিং বাটন, বা মনোযোগ আকর্ষণে।",
    care: "একসঙ্গে অনেক পালস রাখলে صفحা কোলাহলময় হয়; একটাই যথেষ্ট।",
    demo: `<div class="stage-center"><div class="pulse-scene"><span class="pulse-ring"></span><span class="pulse-ring"></span><span class="pulse-ring"></span><span class="pulse-core">লাইভ</span></div></div>`,
    css: `.motion-stage .pulse-scene{position:relative;width:190px;height:190px;display:grid;place-items:center}
.motion-stage .pulse-ring{position:absolute;inset:20px;border-radius:50%;border:1.5px solid var(--accent);opacity:0}
.motion-stage .pulse-core{position:relative;z-index:2;display:grid;place-items:center;width:78px;height:78px;border-radius:50%;background:var(--accent);color:var(--bg);font-size:12px;font-weight:700;letter-spacing:.12em;box-shadow:0 0 0 8px color-mix(in srgb,var(--accent) 12%,transparent)}
.motion-stage.run .pulse-ring{animation:mvPulse calc(2.4s / var(--speed)) var(--mv-ease-out) infinite}
.motion-stage.run .pulse-ring:nth-child(2){animation-delay:calc(.8s / var(--speed))}
.motion-stage.run .pulse-ring:nth-child(3){animation-delay:calc(1.6s / var(--speed))}
@keyframes mvPulse{0%{transform:scale(.45);opacity:.7}80%,100%{transform:scale(1.55);opacity:0}}`,
    snippet: `.ring{animation:pulse 2.4s ease-out infinite}
.ring:nth-child(2){animation-delay:.8s}
.ring:nth-child(3){animation-delay:1.6s}
@keyframes pulse{0%{transform:scale(.45);opacity:.7}
 80%,100%{transform:scale(1.55);opacity:0}}`
  },
  {
    id: 8, slug: "shake", bn: "শেক", en: "Shake",
    desc: "একটা ছোট কম্পন — ভুল হয়েছে, বা কিছু একটা দরকার।",
    use: "ফর্মের ভুল, ভুল পাসওয়ার্ড, বা ‘না’ বোঝাতে।",
    care: "বেশি জোরে বা বেশিক্ষণ শেক করলে অস্বস্তি হয়; ৩০০-৫০০ms যথেষ্ট।",
    demo: `<div class="stage-center"><div class="shake-scene"><span class="shake-bell">🔔</span><span class="shake-text">একটু মনোযোগ</span></div></div>`,
    css: `.motion-stage .shake-scene{display:flex;flex-direction:column;align-items:center;gap:14px}
.motion-stage .shake-bell{font-size:64px;line-height:1;display:block;filter:drop-shadow(0 10px 18px color-mix(in srgb,var(--accent) 25%,transparent))}
.motion-stage .shake-text{font-size:13px;color:var(--muted);letter-spacing:.04em}
.motion-stage.run .shake-bell{animation:mvShake calc(.65s / var(--speed)) var(--mv-ease) infinite}
@keyframes mvShake{0%,100%{transform:rotate(0)}15%{transform:rotate(14deg)}30%{transform:rotate(-12deg)}45%{transform:rotate(9deg)}60%{transform:rotate(-6deg)}75%{transform:rotate(3deg)}}`,
    snippet: `.bell{animation:shake .6s ease infinite}
@keyframes shake{0%,100%{transform:rotate(0)}
 15%{transform:rotate(14deg)}30%{transform:rotate(-12deg)}
 45%{transform:rotate(9deg)}60%{transform:rotate(-6deg)}
 75%{transform:rotate(3deg)}}`
  },
  {
    id: 9, slug: "float", bn: "ফ্লোট", en: "Float",
    desc: "মেঘ বা বেলুন বাতাসে ভেসে থাকে — ধীর, নরম, প্রায় শ্বাসের মতো।",
    use: "হিরো সেকশনের অলংকরণ, ব্যাকগ্রাউন্ড এলিমেন্ট, বা শান্ত মেজাজে।",
    care: "বেশি এলিমেন্ট ভাসালে পারফরম্যান্স কমে; transform-ই ব্যবহার করো।",
    demo: `<div class="stage-center"><div class="float-scene"><span class="float-cloud c1"></span><span class="float-cloud c2"></span><span class="float-cloud c3"></span><span class="float-balloon"></span></div></div>`,
    css: `.motion-stage .float-scene{position:relative;width:min(320px,90%);height:220px}
.motion-stage .float-cloud{position:absolute;width:86px;height:30px;border-radius:999px;background:color-mix(in srgb,var(--panel) 75%,var(--accent));border:1px solid color-mix(in srgb,var(--accent) 20%,var(--line));opacity:.9}
.motion-stage .float-cloud::before,.motion-stage .float-cloud::after{content:"";position:absolute;border-radius:50%;background:inherit;border:inherit}
.motion-stage .float-cloud::before{width:38px;height:38px;left:12px;top:-17px}
.motion-stage .float-cloud::after{width:28px;height:28px;right:12px;top:-12px}
.motion-stage .c1{left:4%;top:22%}
.motion-stage .c2{right:6%;top:12%;transform:scale(.8)}
.motion-stage .c3{left:34%;bottom:16%;transform:scale(.65)}
.motion-stage .float-balloon{position:absolute;right:26%;bottom:24%;width:42px;height:54px;border-radius:50% 50% 46% 46%;background:var(--accent);box-shadow:inset -8px -8px 0 color-mix(in srgb,var(--accent) 55%,#000)}
.motion-stage .float-balloon::after{content:"";position:absolute;left:50%;top:100%;width:1px;height:38px;background:var(--ink);opacity:.35}
.motion-stage.run .float-cloud{animation:mvFloat calc(5s / var(--speed)) ease-in-out infinite}
.motion-stage.run .c2{animation-delay:calc(-1.4s / var(--speed))}
.motion-stage.run .c3{animation-delay:calc(-2.6s / var(--speed))}
.motion-stage.run .float-balloon{animation:mvFloat calc(4.2s / var(--speed)) ease-in-out infinite}
@keyframes mvFloat{0%,100%{translate:0 0}50%{translate:0 -14px}}`,
    snippet: `.cloud{animation:float 5s ease-in-out infinite}
.cloud:nth-child(2){animation-delay:-1.4s}
@keyframes float{0%,100%{translate:0 0}50%{translate:0 -14px}}`
  },
  {
    id: 10, slug: "typewriter", bn: "টাইপরাইটার", en: "Typewriter",
    desc: "অক্ষরগুলো একটা একটা করে লেখা হয়, শেষে কেয়ারেট জ্বলে।",
    use: "হিরোর ট্যাগলাইন, টার্মিনাল-ধাঁচের ইন্টারফেস, বা চিঠির খসড়া।",
    care: "বাংলা অক্ষরে `ch` মাপ নির্ভরযোগ্য নয়; ছোট টেক্সটে width + steps ব্যবহার করো, নইলে clip-path ভালো।",
    demo: `<div class="stage-center"><div class="type-wrap"><span class="type-text">মিউজরা কথা বলে…</span><span class="type-caret"></span><p class="type-sub">তারপর চা, তারপর গল্প।</p></div></div>`,
    css: `.motion-stage .type-wrap{width:min(680px,88%);text-align:left}
.motion-stage .type-text{display:block;font-family:var(--font-head);font-size:clamp(20px,4vw,34px);line-height:1.4;white-space:nowrap;overflow:hidden;width:0;max-width:100%;border-right:0}
.motion-stage .type-caret{display:inline-block;width:2px;height:1.1em;background:var(--accent);vertical-align:-.16em;margin-left:3px;animation:mvCaret .8s steps(1) infinite}
.motion-stage .type-sub{margin-top:14px;font-size:13px;color:var(--muted);opacity:0}
.motion-stage.run .type-text{animation:mvType calc(2.2s / var(--speed)) steps(18) both}
.motion-stage.run .type-sub{animation:mvFadeIn calc(.8s / var(--speed)) ease 2.4s both}
@keyframes mvType{to{width:100%}}
@keyframes mvCaret{50%{opacity:0}}
@keyframes mvFadeIn{to{opacity:1}}`,
    snippet: `.type-text{width:0;overflow:hidden;white-space:nowrap;
  animation:type 3.2s steps(30) both}
@keyframes type{to{width:100%}}
.caret{animation:blink .8s steps(1) infinite}
@keyframes blink{50%{opacity:0}}`
  }
];
