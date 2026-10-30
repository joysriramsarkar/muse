// মিউজ — moderation: ঘরের মালিকের জন্য বার্তা মোছার দরজা (token-সুরক্ষিত)।
// POST {id, token, room?} → {removed: true|false}
//   - token মিলবে Vercel env MODERATION_TOKEN-এর সাথে। env না থাকলে এই দরজা বন্ধ (501)।
//   - token কখনো repo-তে বা client-এ যায় না — শুধু env-তে থাকে।

const { kvConfig, boardRemove, boardKey } = require("./_kv.js");
const { ROOMS } = require("./_adda.js");

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }

  const expected = process.env.MODERATION_TOKEN;
  if (!expected) { res.status(501).json({ error: "moderation_not_configured" }); return; }
  if (!kvConfig()) { res.status(501).json({ error: "board_not_configured" }); return; }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  if (!body || String(body.token || "") !== expected) { res.status(403).json({ error: "forbidden" }); return; }

  const id = String(body.id || "");
  if (!id) { res.status(400).json({ error: "missing_id" }); return; }
  const roomRaw = String(body.room || "").trim();
  const room = roomRaw ? (Object.prototype.hasOwnProperty.call(ROOMS, roomRaw) ? roomRaw : "INVALID") : null;
  if (room === "INVALID") { res.status(400).json({ error: "bad_room", rooms: Object.keys(ROOMS) }); return; }

  try {
    const removed = await boardRemove(id, boardKey(room));
    res.status(200).json({ removed });
  } catch (e) {
    res.status(502).json({ error: "moderate_failed" });
  }
};
