export default async function handler(req, res) {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyZuO12wa0T-Ob4Zo-MmlB9pVP45we3jZvMke7CtA0wMdei7wfQHNuU3SebNlPQosGGFA/exec";

  // OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Build GAS URL for GET
  let url = SCRIPT_URL;
  if (req.method === "GET") {
    const params = new URLSearchParams(req.query);
    url += "?" + params.toString();
  }

  // Build form body for POST
  let body = undefined;
  if (req.method === "POST") {
    const formData = new URLSearchParams();
    for (const key in req.body) {
      formData.append(key, req.body[key]);
    }
    body = formData;
  }

  try {
    // Forward request to GAS
    const gasResponse = await fetch(url, {
      method: req.method,
      body: body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const text = await gasResponse.text();

    // GAS returns HTML, extract JSON inside <pre>
    let match = text.match(/<pre>([\s\S]*?)<\/pre>/i);
    let jsonText = match ? match[1] : text; // fallback

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(200).json(JSON.parse(jsonText));

  } catch (error) {
    return res.status(500).json({
      error: "Proxy Error",
      details: error.toString()
    });
  }
}
