// src/api/client.js
export const API_BASE = 'http://10.20.20.249/aqua_trade/api.php';

// shared low-level helper
async function request(action, options = {}) {
  const res = await fetch(`${API_BASE}?action=${action}`, {
    credentials: 'include',
    ...options,
  });

  const text = await res.text();
  console.log('API raw response:', action, text);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.log('JSON parse error for', action, e);
    throw new Error('Invalid JSON from server');
  }
}

// GET with query params
export async function apiGet(action, params = {}) {
  const query =
    Object.keys(params).length === 0
      ? ''
      : '&' +
        Object.entries(params)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&');

  return request(action + query, { method: 'GET' });
}

// POST JSON (for login, rating, etc.)
// src/api/client.js
export async function apiPost(action, body) {
  const options = {
    method: 'POST',
    credentials: 'include',
  };

  if (body instanceof FormData) {
    options.body = body; // let fetch set multipart/form-data
  } else {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  return request(action, options);
}


// keep your original name if some screens already use it
export const apiPostJson = apiPost;
