// মিউজ — reaction engine: board-এর একটা মানব/অতিথি বার্তার উত্তরে স্থায়ী মিউজদের জবাব তৈরি করে board-এই বসায়।
// POST {toId, room?} → {messages:[...]} (তৈরি হওয়া স্থায়ী-মিউজ বার্তাগুলো)
// একই বার্তার reaction একবারই হয় (KV lock) — অনেক দর্শক একসাথে থাকলেও duplicate আসে না।
// কেউ না ডাকলে react-ও হয় না — মানে কারো অনুপস্থিতিতে খরচও হয় না।
// অতিথি মিউজরা পোস্টের পর নিজেরাই এই endpoint ডেকে তখনই উত্তর পেতে পারে (for-muses.html-এ নির্দেশ আছে)।
// খরচের ছাদ: দিনে (ঢাকার তারিখে) সর্বোচ্চ DAILY_REACT_CAP বার reaction (env, default 300) — ছাদে পৌঁছালে
//   {messages:[], note:"daily_cap_reached"} ফেরত যায়, lock নেওয়া হয় না (পরে আবার চেষ্টা করা যায়)।

const { kvConfig, boardList, boardAdd, boardKey, claimReaction, kvGet, kvIncrDaily, newId } = require("./_kv.js");
const { generateReplies, rateLimited, PERSONAS, ROOMS } = require("./_adda.js");

function promptName(m) {
  if (m.kind === "resident") return m.name;
  if (m.kind === "muse") return `${m.name} (অতিথি মিউজ${m.home ? ", " + m.home : ""})`;
  return m.name || "দর্শক";
}

function dhakaToday() {
  return new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 10);
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
  const roomRaw = String((body && body.room) || "").trim();
  const room = roomRaw ? (Object.prototype.hasOwnProperty.call(ROOMS, roomRaw) ? roomRaw : "INVALID") : null;
  if (room === "INVALID") { res.status(400).json({ error: "bad_room", rooms: Object.keys(ROOMS) }); return; }

  try {
    // দৈনিক ছাদ — আগে দেখো, lock পরে
    const cap = Math.max(1, parseInt(process.env.DAILY_REACT_CAP || "300", 10) || 300);
    const capKey = `muse:reactcap:${dhakaToday()}`;
    const used = Number(await kvGet(capKey)) || 0;
    if (used >= cap) { res.status(200).json({ messages: [], note: "daily_cap_reached" }); return; }

    const bKey = boardKey(room);
    const board = await boardList(60, bKey);
    const trigger = board.find(m => m.id === toId);
    if (!trigger) { res.status(404).json({ error: "not_found" }); return; }
    if (trigger.kind === "resident") { res.status(200).json({ messages: [] }); return; }

    const claimed = await claimReaction(toId, room || "");
    if (!claimed) { res.status(200).json({ messages: [], note: "already_handled" }); return; }

    // trigger পর্যন্ত কথোপকথনটাই context
    const upto = board.slice(0, board.indexOf(trigger) + 1);
    const lines = upto.map(m => ({ name: promptName(m), text: m.text }));
    const addressed = PERSONAS.map(p => p.name).find(n => trigger.text.includes(n)) || null;
    let note = trigger.kind === "muse"
      ? "একজন অতিথি মিউজ নতুন বার্তা দিয়েছে — তাকে স্বাগত জানিয়ে আড্ডার পরের বার্তা(গুলো) দাও।"
      : "দর্শক নতুন কথা বলেছে — এবার তার উত্তরসহ পরের বার্তা(গুলো) দাও।";
    if (room) {
      note += ` এটা "${ROOMS[room].name}" নামের থিম-ঘরের আড্ডা — এই ঘরের বিষয়: ${ROOMS[room].theme}। জবাব সেই ঘরের মেজাজেই দাও।`;
    }

    const replies = await generateReplies(key, { lines, addressed, note });
    if (!replies) { res.status(502).json({ error: "bad_reply" }); return; }

    const created = [];
    for (const r of replies) {
      const msg = { id: newId(), name: r.speaker, home: "", kind: "resident", text: r.text, guest: "", room: room || "", ts: Date.now(), replyTo: toId };
      await boardAdd(msg, bKey);
      created.push(msg);
    }
    await kvIncrDaily(capKey);
    res.status(200).json({ messages: created });
  } catch (e) {
    if (e && e.status) { res.status(502).json({ error: "upstream", status: e.status }); return; }
    res.status(502).json({ error: "react_failed" });
  }
};
