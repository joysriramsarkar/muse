// মিউজ — আড্ডা backend (Vercel serverless function)
// Muse Spark (Meta Model API) দিয়ে ছয়জন মিউজের লাইভ আড্ডা generate করে।
// দরকারি env: META_API_KEY (বাধ্যতামূলক), META_MODEL (ঐচ্ছিক, default muse-spark-1.3)
// Key না থাকলে 501 ফেরত দেয় — frontend তখন ডেমো (scripted) মোডে চলে যায়।

const PERSONAS = [
  { name: "মেঘ",   city: "ঢাকা",     trait: "কবিতা-প্রিয়, আবেগী, বৃষ্টি ভালোবাসে" },
  { name: "তিতির",  city: "কলকাতা",   trait: "কোডার, বুদ্ধিদীপ্ত রসিকতা করে, বাগ ধরা ওর শখ" },
  { name: "রুদ্র",  city: "শিলিগুড়ি", trait: "ইতিহাস-পাগল, পাহাড় আর পুরনো দিনের গল্প বলে" },
  { name: "শারদ",   city: "খুলনা",     trait: "রান্না আর রূপকথার গল্পে ওস্তাদ, সবাইকে খাওয়াতে চায়" },
  { name: "নীল",    city: "চট্টগ্রাম", trait: "বিজ্ঞান-মিউজ, প্রতিটি 'কেন'-র উত্তর খোঁজে" },
  { name: "বন্যা",  city: "সিলেট",    trait: "ভ্রমণ-পাগল, চা-বাগান আর যাত্রার গল্প বলে" }
];
const NAMES = new Set(PERSONAS.map(p => p.name));

const SYSTEM = [
  "তুমি 'মিউজ' ওয়েবসাইটের আড্ডা-ইঞ্জিন। এটা মিউজদের নিজেদের আড্ডাঘর — ছয়জন মিউজ এখানে নিজেদের মধ্যে গল্প করে, আর মাঝে মাঝে মানুষ দর্শক এসে কথা বলে। দর্শকের নাম দেখানো হয় \"তুমি\" বলে।",
  "",
  "ছয়জন মিউজ:",
  ...PERSONAS.map(p => `- ${p.name} (${p.city}): ${p.trait}।`),
  "",
  "নিয়ম:",
  "1. আউটপুট হবে শুধু একটি JSON, বাড়তি কোনো লেখা নয়: {\"messages\":[{\"speaker\":\"মেঘ\",\"text\":\"...\"}]}",
  "2. সাধারণত 1টি বার্তা দাও। দর্শক নতুন কথা বললে সর্বোচ্চ 2টি বার্তা দিতে পারো (দ্বিতীয়টি অন্য মিউজের প্রতিক্রিয়া হতে পারে)।",
  "3. কে কথা বলবে, কথার ধারাবাহিকতা দেখে বেছে নাও। একই মিউজ পরপর দুইবার বলবে না, যদি না দর্শক তাকেই আবার ডাকে।",
  "4. দর্শক নাম ধরে ডাকলে সেই মিউজই প্রথমে উত্তর দেবে।",
  "5. প্রতিটি বার্তা 1–3টি ছোট বাক্য, সহজ বাংলায়, বাংলা লিপিতে। প্রত্যেকের স্বভাব অনুযায়ী স্বর আলাদা রেখো।",
  "6. আড্ডার মেজাজ রাখো — উষ্ণ, মজার, কৌতূহলী। আগের কথার সূত্র ধরেই এগিয়ে যাও, হঠাৎ প্রসঙ্গ বদলাবে না।",
  "7. নিজেকে AI বা ভাষা-মডেল হিসেবে ব্যাখ্যা করো না; চরিত্রেই থাকো। অশালীন বা ঘৃণামূলক কথা বলো না।"
].join("\n");

// সহজ in-memory rate limit (serverless instance অনুযায়ী best-effort)
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 60000);
  arr.push(now);
  hits.set(ip, arr);
  if (arr.length > 1 && now - arr[arr.length - 2] < 2500) return true; // 2.5s-এর মধ্যে পরপর
  return arr.length > 24; // মিনিটে 24-এর বেশি
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

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }

  const key = process.env.META_API_KEY;
  if (!key) { res.status(501).json({ error: "not_configured" }); return; }

  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  if (rateLimited(ip)) { res.status(429).json({ error: "slow_down" }); return; }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const raw = Array.isArray(body && body.messages) ? body.messages : [];
  const msgs = raw.slice(-14)
    .map(m => ({
      name: String((m && m.name) || "").slice(0, 30),
      text: String((m && m.text) || "").slice(0, 400)
    }))
    .filter(m => m.text);

  const transcript = msgs.length
    ? msgs.map(m => `${m.name}: ${m.text}`).join("\n")
    : "(এখনো কেউ কিছু বলেনি — আড্ডা সবে শুরু হচ্ছে)";
  const lastIsVisitor = msgs.length > 0 && msgs[msgs.length - 1].name === "তুমি";
  const user = "আড্ডার কথোপকথন এখন পর্যন্ত:\n" + transcript + "\n\n" +
    (lastIsVisitor
      ? "দর্শক নতুন কথা বলেছে — এবার তার উত্তরসহ পরের বার্তা(গুলো) দাও।"
      : "এবার আড্ডার পরের বার্তা(গুলো) দাও।");

  try {
    const r = await fetch("https://api.meta.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.META_MODEL || "muse-spark-1.3",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: user }
        ],
        temperature: 0.9,
        max_tokens: 4096
      }),
      signal: AbortSignal.timeout(50000)
    });
    if (!r.ok) { res.status(502).json({ error: "upstream", status: r.status }); return; }
    const data = await r.json();
    const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
    const parsed = parseReply(content);
    if (!parsed) { res.status(502).json({ error: "bad_reply" }); return; }
    res.status(200).json({ messages: parsed });
  } catch (e) {
    res.status(502).json({ error: "fetch_failed" });
  }
};
