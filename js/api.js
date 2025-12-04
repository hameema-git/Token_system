// const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwlKv1sUa4uAAWWf3MRJkFhbMy4Z23uOv8fVCQW8FW8BtBzNBU94JDL51bqe2dnuK3mAA/exec';
// const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyZuO12wa0T-Ob4Zo-MmlB9pVP45we3jZvMke7CtA0wMdei7wfQHNuU3SebNlPQosGGFA/exec';
const SCRIPT_URL = '/api/proxy';

const API_KEY = 'abc123';

async function apiGet(action) {
  const url = `${SCRIPT_URL}?action=${encodeURIComponent(action)}&api_key=${API_KEY}`;
  const res = await fetch(url);
  return res.json();
}

async function apiPost(action, data) {
  const form = new URLSearchParams(data || {});
  form.append('action', action);
  form.append('api_key', API_KEY);
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    body: form
  });
  return res.json();
}

console.log('api.js successfully loaded.');
