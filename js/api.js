// =====================================
// FINAL API.js (via Vercel Proxy)
// =====================================

const SCRIPT_URL = "https://token-system-jade.vercel.app/api/proxy";

// Extract JSON from <pre>...</pre> returned by Google Apps Script
async function parsePreResponse(response) {
    const text = await response.text();

    try {
        return JSON.parse(text);   // proxy gives pure JSON now
    } catch (err) {
        throw new Error("Invalid GAS response: " + text);
    }
}


// GET request
export async function apiGet(params = {}) {
    const url = new URL(SCRIPT_URL);
    Object.keys(params).forEach(k => url.searchParams.append(k, params[k]));

    const res = await fetch(url);
    return parsePreResponse(res);
}

// POST request
export async function apiPost(params = {}) {
    const form = new FormData();
    Object.keys(params).forEach(k => form.append(k, params[k]));

    const res = await fetch(SCRIPT_URL, { method: "POST", body: form });
    return parsePreResponse(res);
}

console.log("api.js loaded (VERCEL PROXY VERSION)");
