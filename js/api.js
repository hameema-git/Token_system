// =====================================
// FINAL API JS (Google Apps Script Compatible)
// Reads response inside <pre>...</pre>
// No proxy, direct GAS call
// =====================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZuO12wa0T-Ob4Zo-MmlB9pVP45we3jZvMke7CtA0wMdei7wfQHNuU3SebNlPQosGGFA/exec";

// Extract JSON from inside <pre>...</pre>
async function parsePreResponse(response) {
    const text = await response.text();

    const match = text.match(/<pre>([\s\S]*?)<\/pre>/i);

    if (!match || match.length < 2) {
        throw new Error("Invalid API response: " + text);
    }

    return JSON.parse(match[1]);
}

// GET request
export async function apiGet(params = {}) {
    const url = new URL(SCRIPT_URL);

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const res = await fetch(url.toString(), {
        method: "GET"
    });

    return parsePreResponse(res);
}

// POST request
export async function apiPost(params = {}) {
    const form = new FormData();

    Object.keys(params).forEach(key => {
        form.append(key, params[key]);
    });

    const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: form
    });

    return parsePreResponse(res);
}

console.log("api.js loaded (FINAL VERSION)");
