import fetch from 'node-fetch';

export default async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONS request uchun
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { pathname, search } = new URL(req.url, `http://${req.headers.host}`);
    const path = pathname.replace('/api/proxy', '');
    const backendUrl = `https://e-commerce-api-v4.nt.azimumarov.uz${path}${search}`;

    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error', message: error.message });
  }
};
