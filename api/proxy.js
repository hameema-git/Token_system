export default async function handler(req, res) {
  try {
    const { action, ...rest } = req.query;

    if (!action) {
      return res.status(400).json({ error: "Missing action parameter" });
    }

    const GAS_URL =
      "https://script.google.com/macros/s/AKfycbw_sSmuihZxIAnroqzLFmmCBOpFM5lhjhDdVWoBL6CSjNWWsCMEV5Q62jYg0kOWDCuP2Q/exec";

    const params = new URLSearchParams({ action, ...rest });
    const url = `${GAS_URL}?${params.toString()}`;

    let response;

    if (req.method === "GET") {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: { "Content-Type": "application/json" }
      });
    } else if (req.method === "POST") {
      const form = new URLSearchParams(rest);

      response = await fetch(url, {
        method: "POST",
        body: form,
        redirect: "follow"
      });
    }

    const body = await response.text();

    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    return res.status(200).send(body);

  } catch (error) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

