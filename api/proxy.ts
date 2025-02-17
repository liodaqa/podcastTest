// /api/proxy.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'No url provided' });
    return;
  }
  try {
    const response = await fetch(url);
    const data = await response.text();
    // Set CORS headers so the browser can load the content.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Content-Type',
      response.headers.get('Content-Type') || 'application/json'
    );
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the URL' });
  }
};
