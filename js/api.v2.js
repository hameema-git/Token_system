// js/api.v2.js
const SCRIPT_URL = "/api/proxy"; // use relative path so it works on your vercel domain

async function parseJsonResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    // include text for debugging
    throw new Error("Invalid JSON from GAS/proxy: " + text.slice(0, 300));
  }
}

export async function apiGet(params = {}) {
  const url = new URL(window.location.origin + SCRIPT_URL);
  Object.keys(params).forEach(k => url.searchParams.append(k, params[k]));

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",       // force always fresh data
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    const txt = await res.text().catch(()=>"");
    throw new Error(`Proxy GET failed: ${res.status} ${res.statusText} — ${txt}`);
  }

  return parseJsonResponse(res);
}


