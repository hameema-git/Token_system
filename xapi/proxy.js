export default async function handler(req, res) {
  // Your Google Apps Script Web App URL
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZuO12wa0T-Ob4Zo-MmlB9pVP45we3jZvMke7CtA0wMdei7wfQHNuU3SebNlPQosGGFA/exec";

  // Remove "/api/proxy" from path and add to script URL
  const query = req.url.replace("/api/proxy", "");
  const url = SCRIPT_URL + query;

  // Forward request to Google Apps Script
  const response = await fetch(url, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
  });

  const text = await response.text();

  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).send(text);
}
