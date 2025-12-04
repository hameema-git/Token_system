// =====================================
// FINAL API v2 (Vercel Proxy + GAS)
// =====================================

const SCRIPT_URL = "https://token-system-jade.vercel.app/api/proxy";

// Parse JSON returned by GAS through proxy
async function parsePreResponse(response) {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch (err) {
        throw new Error("Invalid GAS response: " + text);
    }
}

// GET request
export async function apiGet(params = {}) {
    const url = new URL(SCRIPT_URL);
    Object.keys(params).forEach(k => url.searchParams.append(k, params[k]));

    const res = await fetch(url, { method: "GET" });
    return parsePreResponse(res);
}

// POST request (FIXED)
export async function apiPost(params = {}) {
    const body = new URLSearchParams();
    Object.keys(params).forEach(k => body.append(k, params[k]));

    const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    return parsePreResponse(res);
}

console.log("api.v2.js loaded (VERCEL PROXY VERSION)");

