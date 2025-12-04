export default async function handler(req, res) {
  try {
    const { action, ...rest } = req.query;

    if (!action) {
      return res.status(400).json({ error: "Missing action parameter" });
    }

    // Your Google Apps Script deployment URL
    const GAS_URL =
      "https://script.google.com/macros/s/AKfycbw_sSmuihZxIAnroqzLFmmCBOpFM5lhjhDdVWoBL6CSjNWWsCMEV5Q62jYg0kOWDCuP2Q/exec";

    let url = `${GAS_URL}?action=${action}`;

    // Forward GET → GAS
    let gasResponse;

    if (req.method === "GET") {
      gasResponse = await fetch(url);
    }

    // Forward POST → GAS
    else if (req.method === "POST") {
      const form = new URLSearchParams();

      Object.keys(rest).forEach((k) => form.append(k, rest[k]));

      gasResponse = await fetch(url, {
        method: "POST",
        body: form,
      });
    }

    const text = await gasResponse.text();

    // ---- FIX CORS ----
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    return res.status(200).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
