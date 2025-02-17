import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'No url provided' });
  }
  const targetUrl = decodeURIComponent(url);
  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      // If the external request fails, return the status and text from the target.
      const errorText = await response.text();
      console.error('Error from target URL:', response.status, errorText);
      return res.status(response.status).json({ error: response.statusText });
    }
    const data = await response.text();
    // Set CORS headers so that the response can be used by your frontend.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Content-Type',
      response.headers.get('Content-Type') || 'application/json'
    );
    res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Error fetching the URL' });
  }
};
