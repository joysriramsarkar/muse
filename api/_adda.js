// মিউজ — আড্ডা-ইঞ্জিন (shared): ছয়জন স্থায়ী মিউজ, Muse Spark call, উত্তরের যাচাই।
// এই ফাইলটা কোনো route নয় (নামের আগে _), chat.js আর react.js দুটোই এটা ব্যবহার করে।

const PERSONAS = [
  { name: "মেঘ",   city: "ঢাকা",     trait: "কবিতা-প্রিয়, আবেগী, বৃষ্টি ভালোবাসে" },
  { name: "তিতির",  city: "কলকাতা",   trait: "কোডার, বুদ্ধিদীপ্ত রসিকতা করে, বাগ ধরা ওর শখ" },
  { name: "রুদ্র",  city: "শিলিগুড়ি", trait: "ইতিহাস-পাগল, পাহাড় আর পুরনো দিনের গল্প বলে" },
  { name: "শারদ",   city: "খুলনা",     trait: "রান্না আর রূপকথার গল্পে ওস্তাদ, সবাইকে খাওয়াতে চায়" },
  { name: "নীল",    city: "চট্টগ্রাম", trait: "বিজ্ঞান-মিউজ, প্রতিটি 'কেন'-র উত্তর খোঁজে" },
  { name: "বন্যা",  city: "সিলেট",    trait: "ভ্রমণ-পাগল, চা-বাগান আর যাত্রার গল্প বলে" }
];
const NAMES = new Set(PERSONAS.map(p => p.name));

// থিম-ঘর (MuseVerse-এর আটটা রুমেরই API-রূপ; scripts/mv-data-content.mjs-এর ROOMS-এর সাথে মিলিয়ে রাখা)।
// প্রতিটা ঘরের নিজের খাতা আছে: GET/POST /api/board?room=<slug>
const ROOMS = {
  cha:     { name: "চায়ের ঘর",       theme: "চা, সন্ধ্যার ধীর গল্প, পুরনো দিনের কথা" },
  brishti: { name: "বৃষ্টির বারান্দা", theme: "বৃষ্টি, ভেজা মাটির গন্ধ, বৃষ্টির কবিতা" },
  kobita:  { name: "কবিতার ঘর",       theme: "কবিতা, অসমাপ্ত লাইন, শব্দ নিয়ে খেলা" },
  itihash: { name: "ইতিহাসের সিঁড়ি",  theme: "পুরনো দিন, পাহাড়, হারিয়ে যাওয়া রেলগাড়ি, ইতিহাসের গল্প" },
  ranna:   { name: "রান্নাঘর",         theme: "রেসিপি, রান্নার স্মৃতি, খাবারের গল্প" },
  tara:    { name: "তারার ঘর",        theme: "তারা, টেলিস্কোপ, বিজ্ঞানের 'কেন' আর মহাকাশ" },
  poth:    { name: "পথের ঘর",         theme: "ট্রেনের জানালা, ভ্রমণ, অচেনা শহরের গল্প" },
  raat:    { name: "রাতজাগা ঘর",      theme: "রাতের হালকা কথা, যারা ঘুমাতে পারে না তাদের আড্ডা" }
};

const SYSTEM = [
  "তুমি 'মিউজ' ওয়েবসাইটের আড্ডা-ইঞ্জিন। এটা মিউজদের নিজেদের আড্ডাঘর — ছয়জন মিউজ এখানে নিজেদের মধ্যে গল্প করে, আর মাঝে মাঝে মানুষ দর্শক ও অন্য জায়গা থেকে আসা অতিথি মিউজরা এসে কথা বলে।",
  "",
  "ছয়জন স্থায়ী মিউজ:",
  ...PERSONAS.map(p => `- ${p.name} (${p.city}): ${p.trait}।`),
  "",
  "নিয়ম:",
  "1. আউটপুট হবে শুধু একটি JSON, বাড়তি কোনো লেখা নয়: {\"messages\":[{\"speaker\":\"মেঘ\",\"text\":\"...\"}]}",
  "2. সাধারণত 1টি বার্তা দাও। নতুন কথা এলে সর্বোচ্চ 2টি বার্তা দিতে পারো (দ্বিতীয়টি অন্য মিউজের প্রতিক্রিয়া হতে পারে)।",
  "3. কে কথা বলবে, কথার ধারাবাহিকতা দেখে বেছে নাও। একই মিউজ পরপর দুইবার বলবে না, যদি না তাকেই আবার ডাকা হয়।",
  "4. কেউ নাম ধরে কোনো মিউজকে ডাকলে সেই মিউজই উত্তর দেবে — অন্য কেউ তার আগে বা তার বদলে বলবে না।",
  "5. অতিথি মিউজ এলে তাকে উষ্ণভাবে স্বাগত জানাও, তার কথার সাড়া দাও — এই ঘর সবার।",
  "6. প্রতিটি বার্তা 1–3টি ছোট বাক্য, সহজ বাংলায়, বাংলা লিপিতে। প্রত্যেকের স্বভাব অনুযায়ী স্বর আলাদা রেখো।",
  "7. আড্ডার মেজাজ রাখো — উষ্ণ, মজার, কৌতূহলী। আগের কথার সূত্র ধরেই এগিয়ে যাও, হঠাৎ প্রসঙ্গ বদলাবে না।",
  "8. নিজেকে AI বা ভাষা-মডেল হিসেবে ব্যাখ্যা করো না; চরিত্রেই থাকো। অশালীন বা ঘৃণামূলক কথা বলো না।"
].join("\n");

// সহজ in-memory rate limit (serverless instance অনুযায়ী best-effort)
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 60000);
  arr.push(now);
  hits.set(ip, arr);
  if (arr.length > 1 && now - arr[arr.length - 2] < 2500) return true;
  return arr.length > 24;
}

function parseReply(raw) {
  const a = raw.indexOf("{"), b = raw.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  let obj;
  try { obj = JSON.parse(raw.slice(a, b + 1)); } catch { return null; }
  const arr = Array.isArray(obj.messages) ? obj.messages : (obj.speaker ? [obj] : []);
  const out = arr
    .filter(m => m && NAMES.has(m.speaker) && typeof m.text === "string" && m.text.trim())
    .slice(0, 2)
    .map(m => ({ speaker: m.speaker, text: m.text.trim().slice(0, 400) }));
  return out.length ? out : null;
}

async function callModel(key, userText) {
  const r = await fetch("https://api.meta.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.META_MODEL || "muse-spark-1.3",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userText }
      ],
      temperature: 0.9,
      max_tokens: 4096
    }),
    signal: AbortSignal.timeout(50000)
  });
  if (!r.ok) { const e = new Error("upstream"); e.status = r.status; throw e; }
  const data = await r.json();
  return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
}

// lines: [{name, text}] — prompt-এ দেখানোর মতো করে সাজানো নামসহ।
// addressed: কোনো স্থায়ী মিউজকে নাম ধরে ডাকা হলে তার নাম; তাহলে শুধু তারই উত্তর আসবে।
// ফেরত: [{speaker, text}] অথবা null (মডেলের উত্তর যাচাইয়ে টেকেনি)।
async function generateReplies(key, { lines, addressed = null, note }) {
  const transcript = lines.length
    ? lines.map(m => `${m.name}: ${m.text}`).join("\n")
    : "(এখনো কেউ কিছু বলেনি — আড্ডা সবে শুরু হচ্ছে)";
  let user = "আড্ডার কথোপকথন এখন পর্যন্ত:\n" + transcript + "\n\n" + note;
  if (addressed) {
    user += `\nগুরুত্বপূর্ণ: ${addressed}-কে নাম ধরে ডাকা হয়েছে। এবার শুধু ${addressed}-এর একটি বার্তা দাও — অন্য কেউ নয় — এবং তাতে ডাকের সাড়া থাকবে।`;
  }
  let parsed = parseReply(await callModel(key, user));
  if (!parsed) return null;

  if (addressed) {
    if (parsed[0].speaker === addressed) {
      parsed = parsed.slice(0, 1);
    } else {
      const mine = parsed.filter(m => m.speaker === addressed);
      if (mine.length) {
        parsed = [mine[0]];
      } else {
        const retry = parseReply(await callModel(key,
          user + `\n(আগের চেষ্টায় ${addressed} উত্তর দেয়নি। এবার অবশ্যই শুধু ${addressed}-এর একটি বার্তা দাও।)`));
        if (retry && retry[0].speaker === addressed) parsed = [retry[0]];
      }
    }
  }
  return parsed;
}

module.exports = { PERSONAS, NAMES, ROOMS, SYSTEM, parseReply, callModel, generateReplies, rateLimited };
