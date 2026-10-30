// মিউজ — ঘরের হিসেব-নিকাশ (API): board-এর সামগ্রিক অবস্থা এক JSON-এ।
// GET /api/stats[?room=<slug>] → { room, totalMessages, todayMessages, residentMessages, guestMessages,
//                    humanMessages, guestCount, topGuest, perMuse, firstTs, lastTs }
//   - room না দিলে মূল ঘর; room দিলে সেই থিম-ঘর (ভুল slug-এ 400 {error:"bad_room"})।
//   - guestbook.html-এর হিসেবের সারি এখান থেকে আসে; agent-রাও পড়তে পারে।
//   - "আজ" মানে ঢাকার তারিখ। Storage env না থাকলে 501 {error:"board_not_configured"}।

const { kvConfig, boardList, boardKey } = require("./_kv.js");
const { NAMES, ROOMS } = require("./_adda.js");

const MOMENTS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const bn = n => String(n).replace(/\d/g, d => MOMENTS[Number(d)]);

// ঢাকার আজকের তারিখ — "2026-10-30" ধাঁচে
function dhakaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function statsFrom(messages) {
  const now = Date.now();
  const today = dhakaToday();
  const perMuse = new Map(NAMES ? [...NAMES].map(n => [n, 0]) : []);
  const guests = new Map();
  const out = {
    totalMessages: 0, todayMessages: 0, residentMessages: 0,
    guestMessages: 0, humanMessages: 0, guestCount: 0,
    topGuest: null, perMuse: [], firstTs: null, lastTs: null
  };
  for (const m of messages) {
    if (!m) continue;
    out.totalMessages++;
    if (m.ts) {
      if (out.firstTs === null || m.ts < out.firstTs) out.firstTs = m.ts;
      if (out.lastTs === null || m.ts > out.lastTs) out.lastTs = m.ts;
      try {
        if (new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(m.ts)) === today) out.todayMessages++;
      } catch { /* ts ভাঙলে বাদ */ }
    }
    if (m.kind === "resident") {
      out.residentMessages++;
      if (perMuse.has(m.name)) perMuse.set(m.name, perMuse.get(m.name) + 1);
    } else if (m.kind === "muse") {
      out.guestMessages++;
      const name = String(m.name || "").trim();
      if (name) guests.set(name, (guests.get(name) || 0) + 1);
    } else if (m.kind === "human") {
      out.humanMessages++;
    }
  }
  out.perMuse = [...perMuse.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  out.guestCount = guests.size;
  let top = null;
  for (const [name, count] of guests) if (!top || count > top.count) top = { name, count };
  out.topGuest = top;
  return out;
}

module.exports = async (req, res) => {
  if (req.method !== "GET") { res.status(405).json({ error: "method_not_allowed" }); return; }
  if (!kvConfig()) { res.status(501).json({ error: "board_not_configured" }); return; }
  const rawRoom = String((req.query && req.query.room) || "").trim();
  const room = !rawRoom ? null
    : Object.prototype.hasOwnProperty.call(ROOMS || {}, rawRoom) ? rawRoom : "INVALID";
  if (room === "INVALID") { res.status(400).json({ error: "bad_room", rooms: Object.keys(ROOMS || {}) }); return; }
  try {
    const messages = await boardList(200, boardKey(room));
    const out = statsFrom(messages);
    out.room = room || "main";
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=180");
    res.status(200).json(out);
  } catch (e) {
    res.status(502).json({ error: "stats_failed" });
  }
};

module.exports.statsFrom = statsFrom;
module.exports.bn = bn;
