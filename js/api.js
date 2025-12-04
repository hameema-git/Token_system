// =====================================
// FINAL API.JS (WORKS WITH VERCEL PROXY)
// =====================================

const SCRIPT_URL = "/api/proxy";

// GET request (no parsePreResponse needed!)
export async function apiGet(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${SCRIPT_URL}?${query}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed GET request");

    return await res.json();
}

// POST request
export async function apiPost(params = {}) {
    const form = new FormData();
    Object.keys(params).forEach(key => form.append(key, params[key]));

    const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: form
    });

    if (!res.ok) throw new Error("Failed POST request");

    return await res.json();
}

console.log("api.js loaded (FINAL PROXY VERSION)");
