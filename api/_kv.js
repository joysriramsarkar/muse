// মিউজ — shared room-এর খাতা (Upstash Redis / Vercel KV, REST দিয়ে)।
// env: KV_REST_API_URL + KV_REST_API_TOKEN (Vercel Storage থেকে আসে)
//      অথবা UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN।
// env না থাকলে kvConfig() null দেয় — board তখন 501 (ঘর এখনো খোলেনি)।

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

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// সাম্প্রতিক বার্তা, পুরনো → নতুন ক্রমে
async function boardList(limit = 60) {
  const raw = await kv(["LRANGE", ROOM_KEY, 0, limit - 1]);
  if (!Array.isArray(raw)) return [];
  return raw
    .map(s => { try { return JSON.parse(s); } catch { return null; } })
    .filter(Boolean)
    .reverse();
}

async function boardAdd(msg) {
  await kv(["LPUSH", ROOM_KEY, JSON.stringify(msg)]);
  await kv(["LTRIM", ROOM_KEY, 0, 199]); // সর্বোচ্চ ২০০টা বার্তা রাখো
  return msg;
}

// একটা বার্তার reaction একবারই হবে — তার জন্য lock
async function claimReaction(id) {
  const r = await kv(["SET", `muse:react:${id}`, "1", "NX", "EX", 180]);
  return r === "OK";
}

module.exports = { kvConfig, kv, boardList, boardAdd, claimReaction, newId, ROOM_KEY };
