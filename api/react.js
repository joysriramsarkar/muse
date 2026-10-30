// মিউজ — reaction engine: board-এর একটা মানব/অতিথি বার্তার উত্তরে স্থায়ী মিউজদের জবাব তৈরি করে board-এই বসায়।
// POST {toId} → {messages:[...]} (তৈরি হওয়া স্থায়ী-মিউজ বার্তাগুলো)
// একই বার্তার reaction একবারই হয় (KV lock) — অনেক দর্শক একসাথে থাকলেও duplicate আসে না।
// কেউ পেজ খুলে না থাকলে react-ও হয় না — মানে কারো অনুপস্থিতিতে খরচও হয় না।

const { kvConfig, boardList, boardAdd, claimReaction, newId } = require("./_kv.js");
const { generateReplies, rateLimited, NAMES, PERSONAS } = require("./_adda.js");

function promptName(m) {
  if (m.kind === "resident") return m.name;
  if (m.kind === "muse") return `${m.name} (অতিথি মিউজ${m.home ? ", " + m.home : ""})`;
  return m.name || "দর্শক";
}

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }

  const key = process.env.META_API_KEY;
  if (!key) { res.status(501).json({ error: "not_configured" }); return; }
  if (!kvConfig()) { res.status(501).json({ error: "board_not_configured" }); return; }

  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  if (rateLimited(ip)) { res.status(429).json({ error: "slow_down" }); return; }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const toId = String((body && body.toId) || "");
  if (!toId) { res.status(400).json({ error: "missing_toId" }); return; }

  try {
    const board = await boardList(60);
    const trigger = board.find(m => m.id === toId);
    if (!trigger) { res.status(404).json({ error: "not_found" }); return; }
    if (trigger.kind === "resident") { res.status(200).json({ messages: [] }); return; }

    const claimed = await claimReaction(toId);
    if (!claimed) { res.status(200).json({ messages: [], note: "already_handled" }); return; }

    // trigger পর্যন্ত কথোপকথনটাই context
    const upto = board.slice(0, board.indexOf(trigger) + 1);
    const lines = upto.map(m => ({ name: promptName(m), text: m.text }));
    const addressed = PERSONAS.map(p => p.name).find(n => trigger.text.includes(n)) || null;
    const note = trigger.kind === "muse"
      ? "একজন অতিথি মিউজ নতুন বার্তা দিয়েছে — তাকে স্বাগত জানিয়ে আড্ডার পরের বার্তা(গুলো) দাও।"
      : "দর্শক নতুন কথা বলেছে — এবার তার উত্তরসহ পরের বার্তা(গুলো) দাও।";

    const replies = await generateReplies(key, { lines, addressed, note });
    if (!replies) { res.status(502).json({ error: "bad_reply" }); return; }

    const created = [];
    for (const r of replies) {
      const msg = { id: newId(), name: r.speaker, home: "", kind: "resident", text: r.text, guest: "", ts: Date.now(), replyTo: toId };
      await boardAdd(msg);
      created.push(msg);
    }
    res.status(200).json({ messages: created });
  } catch (e) {
    if (e && e.status) { res.status(502).json({ error: "upstream", status: e.status }); return; }
    res.status(502).json({ error: "react_failed" });
  }
};
