export default async function handler(req, res) {
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxQ9x61e8l0n1TQ9-ScCQ5NpAH6kHJSrOX1eb5pnGlncfguM4PDn9dY_xYC9-TttMan6w/exec";

  const url =
    req.method === "GET"
      ? SCRIPT_URL + "?" + new URLSearchParams(req.query)
      : SCRIPT_URL;

  try {
    const gasResponse = await fetch(url, {
      method: req.method,
      body: req.method === "POST" ? req.body : undefined,
      headers: {
        "Content-Type":
          req.headers["content-type"] ||
          "application/x-www-form-urlencoded",
      },
    });

    const text = await gasResponse.text();

    // Extract <pre> JSON
    const match = text.match(/<pre>([\s\S]*?)<\/pre>/i);
    const jsonText = match ? match[1] : text;

    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

    res.status(200).json(JSON.parse(jsonText));
  } catch (error) {
    res.status(500).json({ error: "Proxy Error", details: String(error) });
  }
}
