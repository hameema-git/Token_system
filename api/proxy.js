export default async function handler(req, res) {
  try {
    let params = {};

    // ----------------------------
    // HANDLE GET REQUEST
    // ----------------------------
    if (req.method === "GET") {
      params = req.query;
    }

    // ----------------------------
    // HANDLE POST REQUEST (FIX!)
    // ----------------------------
    else if (req.method === "POST") {
      // Read raw POST body
      const rawBody = await new Promise(resolve => {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => resolve(body));
      });

      // Parse form-urlencoded
      params = Object.fromEntries(new URLSearchParams(rawBody));
    }

    const { action, ...rest } = params;

    if (!action) {
      return res.status(400).json({ error: "Missing action parameter" });
    }

    // GAS URL
    const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzXIwMSbOFpgbgMBZF3kMMBusAwK_9bgzbABuzmku7iW90ZwHvhaSITJR8_J9oXr3ER/exec";

    const sendParams = new URLSearchParams({ action, ...rest });
    const url = `${GAS_URL}?${sendParams.toString()}`;

    let response;

    if (req.method === "GET") {
      response = await fetch(url);
    } else {
      response = await fetch(GAS_URL, {
        method: "POST",
        body: sendParams
      });
    }

    const body = await response.text();

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    return res.status(200).send(body);

  } catch (error) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

