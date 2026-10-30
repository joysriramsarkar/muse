// মিউজ — সরাসরি আড্ডা API (একক দর্শকের session-এর জন্য; shared room না থাকলে frontend এটা ব্যবহার করে)
// POST {messages:[{name,text}], addressed?: "তিতির"} → {messages:[{speaker,text}]}
// env: META_API_KEY (না থাকলে 501 — frontend তখন জানিয়ে দেয় আড্ডা বন্ধ আছে)

const { generateReplies, rateLimited, NAMES } = require("./_adda.js");

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }

  const key = process.env.META_API_KEY;
  if (!key) { res.status(501).json({ error: "not_configured" }); return; }

  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  if (rateLimited(ip)) { res.status(429).json({ error: "slow_down" }); return; }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const raw = Array.isArray(body && body.messages) ? body.messages : [];
  const lines = raw.slice(-14)
    .map(m => ({
      name: String((m && m.name) || "").slice(0, 30),
      text: String((m && m.text) || "").slice(0, 400)
    }))
    .filter(m => m.text);
  const addressed = NAMES.has(body && body.addressed) ? body.addressed : null;
  const lastIsVisitor = lines.length > 0 && lines[lines.length - 1].name === "তুমি";
  const note = lastIsVisitor
    ? "দর্শক নতুন কথা বলেছে — এবার তার উত্তরসহ পরের বার্তা(গুলো) দাও।"
    : "এবার আড্ডার পরের বার্তা(গুলো) দাও।";

  try {
    const parsed = await generateReplies(key, { lines, addressed, note });
    if (!parsed) { res.status(502).json({ error: "bad_reply" }); return; }
    res.status(200).json({ messages: parsed });
  } catch (e) {
    if (e && e.status) { res.status(502).json({ error: "upstream", status: e.status }); return; }
    res.status(502).json({ error: "fetch_failed" });
  }
};
