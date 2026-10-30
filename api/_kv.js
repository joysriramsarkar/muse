// মিউজ — shared room-এর খাতা (Upstash Redis / Vercel KV, REST দিয়ে)।
// env: KV_REST_API_URL + KV_REST_API_TOKEN (Vercel Storage থেকে আসে)
//      অথবা UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN।
// env না থাকলে kvConfig() null দেয় — board তখন 501 (ঘর এখনো খোলেনি)।
//
// খাতা একটা নয়: মূল ঘর (ROOM_KEY) + আটটা থিম-ঘর (boardKey(room))।

function kvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function kv(cmd) {
  const cfg = kvConfig();
  if (!cfg) return null;
  const r = await fetch(cfg.url, {
    method: "POST",
    headers: { "Authorization": `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    signal: AbortSignal.timeout(8000)
  });
  if (!r.ok) throw new Error("kv_" + r.status);
  const d = await r.json();
  if (d.error) throw new Error("kv_error");
  return d.result;
}

const ROOM_KEY = "muse:room:v1";

// থিম-ঘরের খাতার key; room না থাকলে মূল ঘর।
function boardKey(room) {
  return room ? `muse:room:v1:${room}` : ROOM_KEY;
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// সাম্প্রতিক বার্তা, পুরনো → নতুন ক্রমে
async function boardList(limit = 60, key = ROOM_KEY) {
  const raw = await kv(["LRANGE", key, 0, limit - 1]);
  if (!Array.isArray(raw)) return [];
  return raw
    .map(s => { try { return JSON.parse(s); } catch { return null; } })
    .filter(Boolean)
    .reverse();
}

async function boardAdd(msg, key = ROOM_KEY) {
  await kv(["LPUSH", key, JSON.stringify(msg)]);
  await kv(["LTRIM", key, 0, 199]); // সর্বোচ্চ ২০০টা বার্তা রাখো
  return msg;
}

// একটা বার্তা খাতা থেকে মোছা (moderation)। পাওয়া গেলে true।
async function boardRemove(id, key = ROOM_KEY) {
  const raw = await kv(["LRANGE", key, 0, 199]);
  if (!Array.isArray(raw)) return false;
  for (const s of raw) {
    try {
      const m = JSON.parse(s);
      if (m && m.id === id) {
        const n = await kv(["LREM", key, 1, s]);
        return Number(n) > 0;
      }
    } catch { /* ভাঙা entry এড়িয়ে যাও */ }
  }
  return false;
}

// একটা বার্তার reaction একবারই হবে — তার জন্য lock (scope = ঘরের slug, মূল ঘরে "")
async function claimReaction(id, scope = "") {
  const lockKey = scope ? `muse:react:${scope}:${id}` : `muse:react:${id}`;
  const r = await kv(["SET", lockKey, "1", "NX", "EX", 180]);
  return r === "OK";
}

// দৈনিক গণনা (যেমন react-এর খরচের ছাদ): 1 করে বাড়ায়, প্রথমবারে মেয়াদ বসায়।
async function kvIncrDaily(key) {
  const n = await kv(["INCR", key]);
  if (Number(n) === 1) { try { await kv(["EXPIRE", key, 90000]); } catch { /* মেয়াদ না বসলেও গণনা চলবে */ } }
  return Number(n) || 0;
}

async function kvGet(key) {
  return kv(["GET", key]);
}

module.exports = { kvConfig, kv, boardList, boardAdd, boardRemove, claimReaction, newId, ROOM_KEY, boardKey, kvIncrDaily, kvGet };
