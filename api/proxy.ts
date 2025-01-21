import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing "url" query parameter.' });
  }

  try {
    const targetUrl = decodeURIComponent(url as string);
    const response = await fetch(targetUrl);

    const contentType = response.headers.get('content-type');
    const body = await response.text();

    res.setHeader('Content-Type', contentType || 'text/plain');
    res.status(response.status).send(body);
  } catch (error) {
    console.error('[Proxy Error]:', error);
    res.status(500).json({ error: 'Failed to fetch the requested URL.' });
  }
}
