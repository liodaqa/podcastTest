import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { endpoint } = req.query;

  if (!endpoint || Array.isArray(endpoint)) {
    res.status(400).json({ error: 'Invalid or missing endpoint parameter' });
    return;
  }

  try {
    const targetUrl = `https://itunes.apple.com${endpoint}`;
    const response = await fetch(targetUrl);

    if (!response.ok) {
      res
        .status(response.status)
        .json({ error: `Failed to fetch: ${response.statusText}` });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in proxy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
