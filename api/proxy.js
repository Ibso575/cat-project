import https from 'https';
import http from 'http';
import { URL } from 'url';

const BACKEND_URL = 'https://e-commerce-api-v4.nt.azimumarov.uz';

export default async function handler(req, res) {
  // Extract the path from the URL
  const path = req.url.replace('/api', '');
  const targetUrl = `${BACKEND_URL}${path}`;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Construct the full URL with query params
    const urlObj = new URL(targetUrl);
    if (req.query && Object.keys(req.query).length > 0) {
      Object.entries(req.query).forEach(([key, value]) => {
        urlObj.searchParams.append(key, value);
      });
    }

    // Build request options
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Copy relevant headers from incoming request
    if (req.headers['authorization']) {
      options.headers['authorization'] = req.headers['authorization'];
    }
    if (req.headers['content-type']) {
      options.headers['content-type'] = req.headers['content-type'];
    }

    // Make the request using built-in fetch (Node 18+)
    const response = await fetch(urlObj.toString(), {
      method: req.method,
      headers: options.headers,
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body || {}) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}

